SELECT
  md5(
    (
      (su.id || (date(uc.clicked_at)) :: text) || (
        EXTRACT(
          HOUR
          FROM
            uc.clicked_at
        )
      ) :: text
    )
  ) AS id,
  su.id AS shortened_url_id,
  su.short_code,
  su.original_url,
  su.created_at,
  u.id AS user_id,
  u.name AS user_name,
  u.email AS user_email,
  date(uc.clicked_at) AS click_date,
  (
    EXTRACT(
      HOUR
      FROM
        uc.clicked_at
    )
  ) :: integer AS click_hour,
  count(*) AS click_count
FROM
  (
    (
      shortened_urls su
      JOIN url_clicks uc ON ((uc.shortened_url_id = su.id))
    )
    JOIN users u ON ((u.id = su.user_id))
  )
WHERE
  (
    (su.deleted_at IS NULL)
    AND (u.deleted_at IS NULL)
  )
GROUP BY
  su.id,
  su.short_code,
  su.original_url,
  su.created_at,
  u.id,
  u.name,
  u.email,
  (date(uc.clicked_at)),
  (
    EXTRACT(
      HOUR
      FROM
        uc.clicked_at
    )
  );