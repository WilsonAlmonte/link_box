-- name: ListLinks :many
select
  *
from
  links;

-- name: GetLink :one
select * from links
where link_id = $1
limit 1;



-- name: CreateLink :one
insert into links (
  label, value
) values (
  $1, $2
) 
returning *;


-- name: DeleteLink :one
delete from links where link_id = $1
returning link_id;

