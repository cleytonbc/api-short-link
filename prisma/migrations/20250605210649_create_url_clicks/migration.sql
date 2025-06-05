-- CreateTable
CREATE TABLE "url_clicks" (
    "id" TEXT NOT NULL,
    "shortened_url_id" TEXT NOT NULL,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "url_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_url_clicks_shortened_url_id" ON "url_clicks"("shortened_url_id");

-- AddForeignKey
ALTER TABLE "url_clicks" ADD CONSTRAINT "url_clicks_shortened_url_id_fkey" FOREIGN KEY ("shortened_url_id") REFERENCES "shortened_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
