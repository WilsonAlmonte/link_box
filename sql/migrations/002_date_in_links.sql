-- Write your migrate up statements here
alter table links
add column date timestamptz default now ();

---- create above / drop below ----
-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
