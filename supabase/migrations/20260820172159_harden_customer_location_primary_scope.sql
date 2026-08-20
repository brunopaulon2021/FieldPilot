create or replace function private.keep_one_primary_customer_location()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Validate the scoped parent before inspecting primary locations. Besides
  -- preserving the composite FK invariant, this prevents a cross-tenant
  -- insert from learning that another customer's primary location exists via
  -- a partial-unique violation.
  if not exists (
    select 1
    from public.customers
    where id = new.customer_id
      and organization_id = new.organization_id
  ) then
    raise exception 'customer not found'
      using errcode = 'foreign_key_violation';
  end if;

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

revoke execute on function private.keep_one_primary_customer_location()
from public, anon, authenticated;
