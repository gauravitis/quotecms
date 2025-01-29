-- Create items table
create table if not exists items (
    id bigint primary key generated always as identity,
    catalogue_id text,
    description text,
    pack_size text,
    cas text,
    hsn text,
    price numeric,
    brand text,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

-- Create trigger for updated_at
create trigger update_items_updated_at
    before update on items
    for each row
    execute function update_updated_at_column(); 