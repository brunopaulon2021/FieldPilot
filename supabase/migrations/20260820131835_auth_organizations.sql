create schema if not exists private;

revoke all on schema private from public;

create type public.organization_role as enum (
  'owner',
  'admin',
  'dispatcher',
  'technician',
  'customer'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 64),
  timezone text not null default 'Europe/Lisbon' check (char_length(timezone) between 1 and 64),
  country_code text not null default 'PT' check (country_code ~ '^[A-Z]{2}$'),
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.organization_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null check (email = lower(trim(email)) and char_length(email) between 3 and 320),
  role public.organization_role not null check (role <> 'owner'),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  invited_by uuid not null references auth.users (id) on delete restrict,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at),
  check (accepted_at is null or accepted_at >= created_at)
);

create index organization_members_user_id_idx
  on public.organization_members (user_id, organization_id);

create index organizations_created_by_idx
  on public.organizations (created_by);

create index invitations_organization_id_idx
  on public.invitations (organization_id);

create index invitations_invited_by_idx
  on public.invitations (invited_by);

create unique index invitations_pending_email_idx
  on public.invitations (organization_id, email)
  where accepted_at is null;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120)
  );
  return new;
end;
$$;

create function private.add_organization_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create function private.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = (select auth.uid())
  );
$$;

create function private.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = (select auth.uid())
      and role = any(allowed_roles)
  );
$$;

create function private.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE'
    and not exists (
      select 1
      from public.organizations
      where id = old.organization_id
    )
  then
    return old;
  end if;

  if old.role = 'owner'
    and (tg_op = 'DELETE' or new.role <> 'owner')
    and not exists (
      select 1
      from public.organization_members
      where organization_id = old.organization_id
        and user_id <> old.user_id
        and role = 'owner'
    )
  then
    raise exception 'an organization must keep at least one owner'
      using errcode = 'check_violation';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create function private.protect_organization_creator()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.created_by <> old.created_by then
    raise exception 'organization creator cannot be changed'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger organizations_keep_creator
before update of created_by on public.organizations
for each row execute function private.protect_organization_creator();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function private.set_updated_at();

create trigger invitations_set_updated_at
before update on public.invitations
for each row execute function private.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create trigger on_organization_created
after insert on public.organizations
for each row execute function private.add_organization_owner();

create trigger organization_members_keep_owner
before delete or update of role on public.organization_members
for each row execute function private.protect_last_owner();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.invitations enable row level security;

create policy "profiles_select_self"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "profiles_update_self"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "organizations_select_members"
on public.organizations for select
to authenticated
using ((select private.is_organization_member(id)));

create policy "organizations_insert_creator"
on public.organizations for insert
to authenticated
with check (created_by = (select auth.uid()));

create policy "organizations_update_management"
on public.organizations for update
to authenticated
using ((select private.has_organization_role(id, array['owner', 'admin']::public.organization_role[])))
with check (
  (select private.has_organization_role(id, array['owner', 'admin']::public.organization_role[]))
);

create policy "organizations_delete_owner"
on public.organizations for delete
to authenticated
using ((select private.has_organization_role(id, array['owner']::public.organization_role[])));

create policy "organization_members_select_members"
on public.organization_members for select
to authenticated
using ((select private.is_organization_member(organization_id)));

create policy "organization_members_insert_management"
on public.organization_members for insert
to authenticated
with check (
  (select private.has_organization_role(organization_id, array['owner']::public.organization_role[]))
  or (
    role <> 'owner'
    and (select private.has_organization_role(organization_id, array['admin']::public.organization_role[]))
  )
);

create policy "organization_members_update_management"
on public.organization_members for update
to authenticated
using (
  (select private.has_organization_role(organization_id, array['owner']::public.organization_role[]))
  or (
    role <> 'owner'
    and (select private.has_organization_role(organization_id, array['admin']::public.organization_role[]))
  )
)
with check (
  (select private.has_organization_role(organization_id, array['owner']::public.organization_role[]))
  or (
    role <> 'owner'
    and (select private.has_organization_role(organization_id, array['admin']::public.organization_role[]))
  )
);

create policy "organization_members_delete_management"
on public.organization_members for delete
to authenticated
using (
  (select private.has_organization_role(organization_id, array['owner']::public.organization_role[]))
  or (
    role <> 'owner'
    and (select private.has_organization_role(organization_id, array['admin']::public.organization_role[]))
  )
);

create policy "invitations_select_management"
on public.invitations for select
to authenticated
using ((select private.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])));

create policy "invitations_insert_management"
on public.invitations for insert
to authenticated
with check (
  invited_by = (select auth.uid())
  and (select private.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]))
);

create policy "invitations_update_management"
on public.invitations for update
to authenticated
using ((select private.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])))
with check ((select private.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])));

create policy "invitations_delete_management"
on public.invitations for delete
to authenticated
using ((select private.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])));

revoke all on all tables in schema public from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.organizations to authenticated;
grant select, insert, update, delete on table public.organization_members to authenticated;
grant select, insert, update, delete on table public.invitations to authenticated;

revoke all on all functions in schema private from public, anon, authenticated;
alter default privileges in schema private revoke execute on functions from public;
grant usage on schema private to authenticated;
grant execute on function private.is_organization_member(uuid) to authenticated;
grant execute on function private.has_organization_role(uuid, public.organization_role[]) to authenticated;
