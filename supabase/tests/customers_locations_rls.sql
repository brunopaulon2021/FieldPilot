begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '11000000-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'customer-owner-a@example.test', '', now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Owner A"}', now(), now()
  ),
  (
    '22000000-0000-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'customer-owner-b@example.test', '', now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Owner B"}', now(), now()
  ),
  (
    '33000000-0000-4000-8000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'technician-a@example.test', '', now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Technician A"}', now(), now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '11000000-0000-4000-8000-000000000001', true);

insert into public.organizations (id, name, slug, created_by)
values (
  'aa000000-0000-4000-8000-000000000001',
  'Empresa Customer A',
  'empresa-customer-a',
  '11000000-0000-4000-8000-000000000001'
);

insert into public.organization_members (organization_id, user_id, role)
values (
  'aa000000-0000-4000-8000-000000000001',
  '33000000-0000-4000-8000-000000000003',
  'technician'
);

insert into public.customers (
  id, organization_id, kind, display_name, tax_id, email, created_by, updated_by
)
values (
  'ca000000-0000-4000-8000-000000000001',
  'aa000000-0000-4000-8000-000000000001',
  'company',
  'Cliente A',
  'PT501234567',
  'cliente-a@example.test',
  '11000000-0000-4000-8000-000000000001',
  '11000000-0000-4000-8000-000000000001'
);

insert into public.customer_locations (
  id, organization_id, customer_id, name, address_line_1, postal_code, city,
  is_primary, created_by, updated_by
)
values (
  '1a000000-0000-4000-8000-000000000001',
  'aa000000-0000-4000-8000-000000000001',
  'ca000000-0000-4000-8000-000000000001',
  'Sede',
  'Rua A, 10',
  '1000-100',
  'Lisboa',
  false,
  '11000000-0000-4000-8000-000000000001',
  '11000000-0000-4000-8000-000000000001'
);

do $$
begin
  if not (select is_primary from public.customer_locations where id = '1a000000-0000-4000-8000-000000000001') then
    raise exception 'first customer location must become primary';
  end if;
end;
$$;

insert into public.customer_locations (
  id, organization_id, customer_id, name, address_line_1, postal_code, city,
  is_primary, created_by, updated_by
)
values (
  '1a000000-0000-4000-8000-000000000002',
  'aa000000-0000-4000-8000-000000000001',
  'ca000000-0000-4000-8000-000000000001',
  'Armazém',
  'Rua B, 20',
  '2000-200',
  'Santarém',
  true,
  '11000000-0000-4000-8000-000000000001',
  '11000000-0000-4000-8000-000000000001'
);

do $$
begin
  if (select count(*) from public.customer_locations where customer_id = 'ca000000-0000-4000-8000-000000000001' and is_primary) <> 1 then
    raise exception 'customer must have exactly one primary location';
  end if;

  if (select is_primary from public.customer_locations where id = '1a000000-0000-4000-8000-000000000001') then
    raise exception 'old primary location was not replaced';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '33000000-0000-4000-8000-000000000003', true);

do $$
declare
  affected integer;
begin
  if (select count(*) from public.customers) <> 1 then
    raise exception 'technician cannot read its organization customers';
  end if;

  update public.customers
  set display_name = 'Alteração indevida',
      updated_by = '33000000-0000-4000-8000-000000000003'
  where id = 'ca000000-0000-4000-8000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'technician can update a customer';
  end if;

  begin
    insert into public.customers (
      organization_id, display_name, created_by, updated_by
    ) values (
      'aa000000-0000-4000-8000-000000000001',
      'Cliente indevido',
      '33000000-0000-4000-8000-000000000003',
      '33000000-0000-4000-8000-000000000003'
    );
    raise exception 'technician can insert a customer';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', '22000000-0000-4000-8000-000000000002', true);

insert into public.organizations (id, name, slug, created_by)
values (
  'bb000000-0000-4000-8000-000000000002',
  'Empresa Customer B',
  'empresa-customer-b',
  '22000000-0000-4000-8000-000000000002'
);

do $$
declare
  affected integer;
begin
  if exists (select 1 from public.customers where id = 'ca000000-0000-4000-8000-000000000001') then
    raise exception 'tenant B can select tenant A customer';
  end if;

  if exists (select 1 from public.customer_locations where customer_id = 'ca000000-0000-4000-8000-000000000001') then
    raise exception 'tenant B can select tenant A locations';
  end if;

  update public.customers
  set display_name = 'Intrusão',
      updated_by = '22000000-0000-4000-8000-000000000002'
  where id = 'ca000000-0000-4000-8000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'tenant B can update tenant A customer';
  end if;

  begin
    insert into public.customers (
      organization_id, display_name, created_by, updated_by
    ) values (
      'aa000000-0000-4000-8000-000000000001',
      'Cliente cross-tenant',
      '22000000-0000-4000-8000-000000000002',
      '22000000-0000-4000-8000-000000000002'
    );
    raise exception 'tenant B can insert a customer into tenant A';
  exception
    when insufficient_privilege then null;
  end;

  begin
    insert into public.customer_locations (
      organization_id, customer_id, name, address_line_1, postal_code, city,
      created_by, updated_by
    ) values (
      'bb000000-0000-4000-8000-000000000002',
      'ca000000-0000-4000-8000-000000000001',
      'Local cross-tenant',
      'Rua X, 1',
      '3000-300',
      'Coimbra',
      '22000000-0000-4000-8000-000000000002',
      '22000000-0000-4000-8000-000000000002'
    );
    raise exception 'tenant B can attach a location to tenant A customer';
  exception
    when foreign_key_violation or insufficient_privilege then null;
  end;

  begin
    delete from public.customers
    where organization_id = 'bb000000-0000-4000-8000-000000000002';
    raise exception 'authenticated role unexpectedly has customer delete permission';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

insert into public.customers (
  id, organization_id, display_name, created_by, updated_by
)
values (
  'cb000000-0000-4000-8000-000000000002',
  'bb000000-0000-4000-8000-000000000002',
  'Cliente B',
  '22000000-0000-4000-8000-000000000002',
  '22000000-0000-4000-8000-000000000002'
);

do $$
begin
  if (select count(*) from public.customers) <> 1 then
    raise exception 'tenant B cannot read exactly its own customer';
  end if;
end;
$$;

rollback;
