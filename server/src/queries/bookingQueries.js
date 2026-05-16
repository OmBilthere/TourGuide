export const createBookingQuery = `
WITH reserved_slot AS (
    UPDATE guide_slots
    SET is_available = false
    WHERE id = $4
      AND guide_id = $2
      AND is_available = true
    RETURNING id
)
INSERT INTO bookings (
    user_id,
    guide_id,
    city_id,
    slot_id,
    booking_status,
    payment_status,
    amount,
    trip_date
)
SELECT $1, $2, $3, reserved_slot.id, 'requested', 'pending', $5, $6
FROM reserved_slot
RETURNING *;
`;


export const getBookingHistoryQuery = `
SELECT
    b.id,
    b.booking_status,
    b.payment_status,
    b.amount,
    b.booked_at,
    b.trip_date,
    b.completion_code,

    c.city_name AS city,

    gs.slot_label,

    g.id AS guide_id,
    u.full_name AS guide_name,
    u.avatar_url AS guide_image,
        CASE
            WHEN b.payment_status = 'paid' THEN u.email
            ELSE NULL
        END AS guide_email,
        CASE
            WHEN b.payment_status = 'paid' THEN u.phone
            ELSE NULL
        END AS guide_number,
    g.speciality,
    g.price

FROM bookings b
JOIN guides g
    ON b.guide_id = g.id
JOIN users u
    ON g.user_id = u.clerk_user_id
JOIN cities c
    ON b.city_id = c.id
LEFT JOIN guide_slots gs
    ON b.slot_id = gs.id

WHERE b.user_id = $1
ORDER BY b.booked_at DESC;
`;


export const getBookingForPaymentQuery = `
SELECT
        id,
        user_id,
        amount,
        booking_status,
        payment_status
FROM bookings
WHERE id = $1;
`;


export const verifyAndMarkPaidQuery = `
UPDATE bookings
SET payment_status = 'paid'
WHERE id = $1
    AND booking_status = 'confirmed'
    AND payment_status <> 'paid'
RETURNING *;
`;

export const getBookingOwnerQuery = `
SELECT id, user_id
FROM bookings
WHERE id = $1;
`;

export const getBookingSlotQuery = `
SELECT slot_id
FROM bookings
WHERE id = $1;
`;


export const cancelBookingQuery = `
UPDATE bookings
SET booking_status = 'cancelled'
WHERE id = $1
RETURNING *;
`;

export const restoreSlotAvailabilityQuery = `
UPDATE guide_slots
SET is_available = true
WHERE id = $1;
`;



