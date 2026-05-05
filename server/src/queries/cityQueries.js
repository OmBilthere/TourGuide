export const getAllCitiesQuery = `
SELECT
    c.id,
    c.city_name AS city,
    c.famous_place_name,
    c.place_description,
    MIN(ci.image_url) AS cover_image,
    COUNT(DISTINCT g.id) AS total_guides
FROM cities c
LEFT JOIN city_images ci ON c.id = ci.city_id
LEFT JOIN guides g ON c.id = g.city_id
GROUP BY c.id, c.city_name, c.famous_place_name, c.place_description
ORDER BY total_guides DESC;
`;

export const getCityByNameQuery = `
SELECT
    c.id,
    c.place_description,
    MIN(ci.image_url) AS cover_image,
    COALESCE(
        ARRAY_AGG(DISTINCT ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL),
        ARRAY[]::text[]
    ) AS images
FROM cities c
LEFT JOIN city_images ci ON c.id = ci.city_id
WHERE LOWER(c.city_name) = LOWER($1)
GROUP BY c.id, c.place_description
LIMIT 1;
`;