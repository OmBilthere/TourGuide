export const getGuidesByCityQuery = `
SELECT
    g.id,
    u.full_name AS name,
    u.avatar_url AS image,
    c.city_name AS city,
    g.speciality,
    g.price_per_hour,
    g.rating,
    g.total_reviews,
    g.experience_years,
    g.about,

    COALESCE(
      ARRAY_AGG(DISTINCT gl.language_name)
      FILTER (WHERE gl.language_name IS NOT NULL),
      '{}'
    ) AS languages,

    COALESCE(
      ARRAY_AGG(DISTINCT gh.title)
      FILTER (WHERE gh.title IS NOT NULL),
      '{}'
    ) AS highlights,

    COALESCE(
      ARRAY_AGG(DISTINCT gs.slot_label)
      FILTER (WHERE gs.slot_label IS NOT NULL),
      '{}'
    ) AS available_slots
  
FROM guides g
JOIN users u ON g.user_id = u.clerk_user_id
JOIN cities c ON g.city_id = c.id
LEFT JOIN guide_languages gl ON g.id = gl.guide_id
LEFT JOIN guide_highlights gh ON g.id = gh.guide_id
LEFT JOIN guide_slots gs ON g.id = gs.guide_id
 
WHERE LOWER(c.city_name) = LOWER($1)  
    
GROUP BY
    g.id,
    u.full_name,
    u.avatar_url,
    c.city_name,
    g.speciality,
    g.price_per_hour,
    g.rating,
    g.total_reviews,
    g.experience_years,
    g.about;
`;

export const getGuideByIdQuery = `
SELECT
    g.id,
    g.city_id,
    u.full_name AS name,
    u.avatar_url AS image,
    c.city_name AS city,
    g.speciality,
    g.price_per_hour,
    g.rating,
    g.total_reviews,
    g.experience_years,
    g.about,

    COALESCE(
      ARRAY_AGG(DISTINCT gl.language_name)
      FILTER (WHERE gl.language_name IS NOT NULL),
      '{}'
    ) AS languages,

    COALESCE(
      ARRAY_AGG(DISTINCT gh.title)
      FILTER (WHERE gh.title IS NOT NULL),
      '{}'
    ) AS highlights,

    COALESCE(
      JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
          'id', gs.id,
          'label', gs.slot_label
        )
      ) FILTER (WHERE gs.id IS NOT NULL),
      '[]'
    ) AS available_slots

FROM guides g
JOIN users u ON g.user_id = u.clerk_user_id
JOIN cities c ON g.city_id = c.id
LEFT JOIN guide_languages gl ON g.id = gl.guide_id
LEFT JOIN guide_highlights gh ON g.id = gh.guide_id
LEFT JOIN guide_slots gs ON g.id = gs.guide_id

WHERE g.id = $1

GROUP BY
    g.id,
    g.city_id,
    u.full_name,
    u.avatar_url,
    c.city_name,
    g.speciality,
    g.price_per_hour,
    g.rating,
    g.total_reviews,
    g.experience_years,
    g.about;
`;

export const getGuideBookingsQuery = `
SELECT
    b.id,
    b.booking_status,
    b.payment_status,
    b.amount,
    b.booked_at,
    b.trip_date,

    c.city_name AS city,
    
    gs.slot_label,

    u.clerk_user_id AS tourist_id,
    u.full_name AS tourist_name,
    u.avatar_url AS tourist_image

FROM bookings b
JOIN users u
    ON b.user_id = u.clerk_user_id
JOIN cities c
    ON b.city_id = c.id
LEFT JOIN guide_slots gs
    ON b.slot_id = gs.id

WHERE b.guide_id = $1
ORDER BY b.booked_at DESC;
`;

export const confirmGuideBookingQuery = `
UPDATE bookings
SET booking_status = 'confirmed'
WHERE id = $1
RETURNING *;
`;

export const completeGuideBookingQuery = `
UPDATE bookings
SET booking_status = 'completed',
    payment_status = 'paid'
WHERE id = $1
RETURNING *;
`;