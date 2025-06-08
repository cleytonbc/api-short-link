CREATE OR REPLACE VIEW vw_url_clicks_summary AS
SELECT
  md5(
    su.id ||
    DATE(uc.clicked_at)::text ||
    EXTRACT(HOUR FROM uc.clicked_at)::text
  ) AS id,
  su.id AS shortened_url_id,
  su.short_code,
  su.original_url,
  su.created_at,
  u.id AS user_id,
  u.name AS user_name,
  u.email AS user_email,
  DATE(uc.clicked_at) AS click_date,
  EXTRACT(HOUR FROM uc.clicked_at)::int AS click_hour,
    COUNT(*) AS click_count

FROM
  shortened_urls su
INNER JOIN
  url_clicks uc ON uc.shortened_url_id = su.id
INNER JOIN
  users u ON u.id = su.user_id
WHERE
  su.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY
  su.id, su.short_code, su.original_url, su.created_at,
  u.id, u.name, u.email,
  DATE(uc.clicked_at), EXTRACT(HOUR FROM uc.clicked_at);
