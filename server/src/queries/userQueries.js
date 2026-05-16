export const upsertUserQuery = `
  insert into users (
    clerk_user_id,
    full_name,
    email,
    phone,
    avatar_url,
    role
  )
  values ($1, $2, $3, $4, $5, $6)
  on conflict (clerk_user_id)
  do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = COALESCE(excluded.phone, users.phone),
    avatar_url = excluded.avatar_url,
    role = excluded.role
  returning *;
`;

export const updateUserPhoneQuery = `
  UPDATE users
  SET phone = $2
  WHERE clerk_user_id = $1
  RETURNING *;
`;
