-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL,
    "short_code" VARCHAR(6) NOT NULL,
    "original_url" TEXT NOT NULL,
    "user_id" TEXT,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "shortened_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_short_code_key" ON "shortened_urls"("short_code");

-- CreateIndex
CREATE INDEX "idx_shortened_urls_short_code" ON "shortened_urls"("short_code");

-- CreateIndex
CREATE INDEX "idx_shortened_urls_user_id" ON "shortened_urls"("user_id");

-- AddForeignKey
ALTER TABLE "shortened_urls" ADD CONSTRAINT "shortened_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
