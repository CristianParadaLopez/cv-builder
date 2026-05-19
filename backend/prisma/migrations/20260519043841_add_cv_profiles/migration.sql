-- CreateTable
CREATE TABLE "CVProfile" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CVProfile" ADD CONSTRAINT "CVProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
