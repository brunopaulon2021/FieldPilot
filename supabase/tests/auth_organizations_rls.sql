begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'owner-a@example.test', '', now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Owner A"}', now(), now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'owner-b@example.test', '', now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Owner B"}', now(), now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);

insert into public.organizations (id, name, slug, created_by)
values ('a0000000-0000-0000-0000-000000000001', 'Empresa A', 'empresa-a', '10000000-0000-0000-0000-000000000001')
returning id;

do $$
begin
  if (select count(*) from public.organization_members where organization_id = 'a0000000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'organization A must receive exactly one owner membership';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000002', true);

insert into public.organizations (id, name, slug, created_by)
values ('b0000000-0000-0000-0000-000000000002', 'Empresa B', 'empresa-b', '20000000-0000-0000-0000-000000000002');

do $$
begin
  if (select count(*) from public.organizations) <> 1 then
    raise exception 'tenant B can read an organization other than its own';
  end if;

  if exists (select 1 from public.organizations where id = 'a0000000-0000-0000-0000-000000000001') then
    raise exception 'tenant B can select tenant A';
  end if;

  if (select count(*) from public.profiles) <> 1 then
    raise exception 'tenant B can read another profile';
  end if;
end;
$$;

do $$
declare
  affected integer;
begin
  update public.organizations
  set name = 'Intrusão'
  where id = 'a0000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'tenant B can update tenant A';
  end if;

  delete from public.organizations
  where id = 'a0000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'tenant B can delete tenant A';
  end if;
end;
$$;

do $$
begin
  begin
    insert into public.organization_members (organization_id, user_id, role)
    values (
      'a0000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000002',
      'admin'
    );
    raise exception 'tenant B can insert a member into tenant A';
  exception
    when insufficient_privilege then null;
  end;

  begin
    insert into public.invitations (organization_id, email, role, token_hash, invited_by, expires_at)
    values (
      'a0000000-0000-0000-0000-000000000001',
      'intruder@example.test',
      'admin',
      repeat('a', 64),
      '20000000-0000-0000-0000-000000000002',
      now() + interval '1 day'
    );
    raise exception 'tenant B can insert an invitation into tenant A';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

do $$
declare
  affected integer;
begin
  delete from public.organizations
  where id = 'b0000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'tenant B cannot delete its own organization';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);

do $$
declare
  affected integer;
begin
  update public.organizations set name = 'Empresa A Atualizada'
  where id = 'a0000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'tenant A cannot update its own organization';
  end if;

  begin
    delete from public.organization_members
    where organization_id = 'a0000000-0000-0000-0000-000000000001'
      and user_id = '10000000-0000-0000-0000-000000000001';
    raise exception 'last owner could be deleted';
  exception
    when check_violation then null;
  end;
end;
$$;

rollback;
