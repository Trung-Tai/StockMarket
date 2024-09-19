-- CreateTable
CREATE TABLE "tb_transactions" (
    "id" SERIAL NOT NULL,
    "gateway" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountNumber" TEXT,
    "subAccount" TEXT,
    "amountIn" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "amountOut" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "accumulated" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "code" TEXT,
    "transactionContent" TEXT,
    "referenceNumber" TEXT,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_transactions_pkey" PRIMARY KEY ("id")
);
