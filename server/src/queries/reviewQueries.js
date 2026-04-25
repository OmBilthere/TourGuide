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