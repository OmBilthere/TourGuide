export const upsertUserQuery = `
  insert into users (
    clerk_user_id,
    full_name,
    email,
    avatar_url,
    role
  )
  values ($1, $2, $3, $4, $5)
  on conflict (clerk_user_id)
  do update set
    full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    role = excluded.role
  returning *;
`;