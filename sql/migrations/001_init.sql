-- Write your migrate up statements here
create table links (
  link_id bigserial primary key,
  label text not null,
  value text not null
)
---- create above / drop below ----
-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
