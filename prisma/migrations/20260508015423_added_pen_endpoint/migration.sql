-- CreateTable
CREATE TABLE "Pen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Pen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "penId" TEXT NOT NULL,
    "inkColor" TEXT NOT NULL,
    "tipSize" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_penId_fkey" FOREIGN KEY ("penId") REFERENCES "Pen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
