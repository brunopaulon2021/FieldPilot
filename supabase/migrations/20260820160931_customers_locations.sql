create type public.customer_kind as enum (
  'company',
  'individual'
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind public.customer_kind not null default 'company',
  display_name text not null check (char_length(trim(display_name)) between 2 and 160),
  legal_name text check (legal_name is null or char_length(trim(legal_name)) between 2 and 160),
  tax_id text check (tax_id is null or char_length(trim(tax_id)) between 3 and 32),
  email text check (
    email is null
    or (email = lower(trim(email)) and char_length(email) between 3 and 320)
  ),
  phone text check (phone is null or char_length(trim(phone)) between 6 and 40),
  notes text check (notes is null or char_length(notes) <= 2000),
  archived_at timestamptz,
  created_by uuid not null references auth.users (id) on delete restrict,
  updated_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id)
);

create table public.customer_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null,
  name text not null check (char_length(trim(name)) between 2 and 120),
  address_line_1 text not null check (char_length(trim(address_line_1)) between 3 and 180),
  address_line_2 text check (address_line_2 is null or char_length(trim(address_line_2)) between 2 and 180),
  postal_code text not null check (char_length(trim(postal_code)) between 3 and 20),
  city text not null check (char_length(trim(city)) between 2 and 120),
  region text check (region is null or char_length(trim(region)) between 2 and 120),
  country_code text not null default 'PT' check (country_code ~ '^[A-Z]{2}$'),
  access_notes text check (access_notes is null or char_length(access_notes) <= 1000),
  is_primary boolean not null default false,
  created_by uuid not null references auth.users (id) on delete restrict,
  updated_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_locations_customer_scope_fkey
    foreign key (customer_id, organization_id)
    references public.customers (id, organization_id)
    on delete cascade
);

create index customers_organization_active_name_idx
  on public.customers (organization_id, archived_at, display_name, id);

create unique index customers_organization_tax_id_idx
  on public.customers (organization_id, lower(tax_id))
  where tax_id is not null;

create index customers_created_by_idx
  on public.customers (created_by);

create index customers_updated_by_idx
  on public.customers (updated_by);

create index customer_locations_organization_customer_idx
  on public.customer_locations (organization_id, customer_id, is_primary desc, name, id);

create index customer_locations_created_by_idx
  on public.customer_locations (created_by);

create index customer_locations_updated_by_idx
  on public.customer_locations (updated_by);

create unique index customer_locations_one_primary_idx
  on public.customer_locations (customer_id)
  where is_primary;

create function private.protect_customer_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.organization_id <> old.organization_id
    or new.created_by <> old.created_by
  then
    raise exception 'customer ownership cannot be changed'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create function private.protect_customer_location_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.organization_id <> old.organization_id
    or new.customer_id <> old.customer_id
    or new.created_by <> old.created_by
  then
    raise exception 'customer location ownership cannot be changed'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create function private.keep_one_primary_customer_location()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Updating the previous primary row invokes this trigger recursively. In that
  -- nested call we must keep the requested false value so the outer operation
  -- can promote the new primary without violating the partial unique index.
  if pg_trigger_depth() > 1 then
    return new;
  end if;

  if new.is_primary then
    update public.customer_locations
    set is_primary = false,
        updated_by = new.updated_by
    where customer_id = new.customer_id
      and id <> new.id
      and is_primary;
  elsif not exists (
    select 1
    from public.customer_locations
    where customer_id = new.customer_id
      and id <> new.id
      and is_primary
  ) then
    new.is_primary = true;
  end if;

  return new;
end;
$$;

create trigger customers_set_updated_at
before update on public.customers
for each row execute function private.set_updated_at();

create trigger customers_keep_identity
before update of organization_id, created_by on public.customers
for each row execute function private.protect_customer_identity();

create trigger customer_locations_set_updated_at
before update on public.customer_locations
for each row execute function private.set_updated_at();

create trigger customer_locations_keep_identity
before update of organization_id, customer_id, created_by on public.customer_locations
for each row execute function private.protect_customer_location_identity();

create trigger customer_locations_keep_primary
before insert or update of is_primary on public.customer_locations
for each row execute function private.keep_one_primary_customer_location();

alter table public.customers enable row level security;
alter table public.customer_locations enable row level security;

create policy "customers_select_operations"
on public.customers for select
to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher', 'technician']::public.organization_role[]
  ))
);

create policy "customers_insert_management"
on public.customers for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
);

create policy "customers_update_management"
on public.customers for update
to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
)
with check (
  updated_by = (select auth.uid())
  and (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
);

create policy "customer_locations_select_operations"
on public.customer_locations for select
to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher', 'technician']::public.organization_role[]
  ))
);

create policy "customer_locations_insert_management"
on public.customer_locations for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
);

create policy "customer_locations_update_management"
on public.customer_locations for update
to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
)
with check (
  updated_by = (select auth.uid())
  and (select private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'dispatcher']::public.organization_role[]
  ))
);

revoke all on table public.customers from anon, authenticated;
revoke all on table public.customer_locations from anon, authenticated;

grant select, insert, update on table public.customers to authenticated;
grant select, insert, update on table public.customer_locations to authenticated;

revoke execute on function private.protect_customer_identity() from public, anon, authenticated;
revoke execute on function private.protect_customer_location_identity() from public, anon, authenticated;
revoke execute on function private.keep_one_primary_customer_location() from public, anon, authenticated;
