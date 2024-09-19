-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "accountNumber" TEXT,
    "subAccount" TEXT,
    "amountIn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amountOut" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accumulated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT,
    "transactionContent" TEXT,
    "referenceNumber" TEXT,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
