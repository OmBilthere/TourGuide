export const createReviewQuery = `
INSERT INTO reviews (
    booking_id,
    user_id,
    guide_id,
    rating,
    review_text
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const getReviewsByGuideQuery = `
SELECT 
    r.id,
    r.booking_id,
    r.user_id,
    r.guide_id,
    r.rating,
    r.review_text,
    r.created_at,
    u.full_name as user_name,
    u.avatar_url
FROM reviews r
JOIN users u ON r.user_id = u.clerk_user_id
WHERE r.guide_id = $1
ORDER BY r.created_at DESC;
`;

export const updateGuideRatingQuery = `
UPDATE guides
SET
    rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE guide_id = $1
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE guide_id = $1
    )
WHERE id = $1;
`;