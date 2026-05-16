export const getGuidesByCityQuery = `
SELECT
    g.id,
    u.full_name AS name,
    u.avatar_url AS image,
    c.city_name AS city,
    g.speciality,
    g.price,
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
    g.price,
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
    g.price,
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
          'label', gs.slot_label,
          'is_available', gs.is_available
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
    g.price,
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

export const getGuideIdByUserIdQuery = `
SELECT id
FROM guides
WHERE user_id = $1
LIMIT 1;
`;

export const getGuideProfileByUserIdQuery = `
SELECT
    g.id,
    g.user_id,
    c.city_name AS city,
    g.speciality,
    g.price,
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
    ) AS slots,
    COALESCE(BOOL_OR(gs.is_available), false) AS has_available_slots
FROM guides g
JOIN cities c ON g.city_id = c.id
LEFT JOIN guide_languages gl ON g.id = gl.guide_id
LEFT JOIN guide_highlights gh ON g.id = gh.guide_id
LEFT JOIN guide_slots gs ON g.id = gs.guide_id
WHERE g.user_id = $1
GROUP BY
    g.id,
    g.user_id,
    c.city_name,
    g.speciality,
    g.price,
    g.experience_years,
    g.about
LIMIT 1;
`;

export const updateGuideSlotsAvailabilityByGuideIdQuery = `
UPDATE guide_slots
SET is_available = $2
WHERE guide_id = $1;
`;

export const getCityIdByNameQuery = `
SELECT id
FROM cities
WHERE LOWER(city_name) = LOWER($1)
LIMIT 1;
`;

export const upsertGuideByUserIdQuery = `
WITH updated AS (
  UPDATE guides
  SET
    city_id = $2,
    speciality = $3,
    price = $4,
    experience_years = $5,
    about = $6
  WHERE user_id = $1
  RETURNING id
),
inserted AS (
  INSERT INTO guides (user_id, city_id, speciality, price, experience_years, about)
  SELECT $1, $2, $3, $4, $5, $6
  WHERE NOT EXISTS (SELECT 1 FROM updated)
  RETURNING id
)
SELECT id FROM updated
UNION ALL
SELECT id FROM inserted;
`;

export const deleteGuideLanguagesByGuideIdQuery = `
DELETE FROM guide_languages
WHERE guide_id = $1;
`;

export const insertGuideLanguageQuery = `
INSERT INTO guide_languages (guide_id, language_name)
VALUES ($1, $2);
`;

export const deleteGuideHighlightsByGuideIdQuery = `
DELETE FROM guide_highlights
WHERE guide_id = $1;
`;

export const insertGuideHighlightQuery = `
INSERT INTO guide_highlights (guide_id, title)
VALUES ($1, $2);
`;

export const deleteGuideSlotsByGuideIdQuery = `
DELETE FROM guide_slots
WHERE guide_id = $1;
`;

export const insertGuideSlotQuery = `
INSERT INTO guide_slots (guide_id, slot_label, is_available)
VALUES ($1, $2, true);
`;

export const confirmGuideBookingQuery = `
UPDATE bookings
SET booking_status = 'confirmed'
WHERE id = $1
  AND guide_id = $2
RETURNING *;
`;

export const completeGuideBookingQuery = `
UPDATE bookings
SET booking_status = 'completed',
    payment_status = 'paid'
WHERE id = $1
  AND guide_id = $2
RETURNING *;
`;