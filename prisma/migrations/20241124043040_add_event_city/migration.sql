-- CreateTable
CREATE TABLE "event_city" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_city_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_city_event_id_city_id_key" ON "event_city"("event_id", "city_id");

-- AddForeignKey
ALTER TABLE "event_city" ADD CONSTRAINT "event_city_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_city" ADD CONSTRAINT "event_city_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
