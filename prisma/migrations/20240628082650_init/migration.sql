-- CreateTable
CREATE TABLE "covered_warrants" (
    "warrant_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "underlying_asset_id" INTEGER,
    "issue_date" DATE,
    "expiration_date" DATE,
    "strike_price" DECIMAL(18,4),
    "warrant_type" VARCHAR(50),

    CONSTRAINT "covered_warrants_pkey" PRIMARY KEY ("warrant_id")
);

-- CreateTable
CREATE TABLE "derivatives" (
    "derivative_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "underlying_asset_id" INTEGER,
    "contract_size" INTEGER,
    "expiration_date" DATE,
    "strike_price" DECIMAL(18,4),
    "last_price" DECIMAL(18,2) NOT NULL,
    "change" DECIMAL(18,2) NOT NULL,
    "percent_change" DECIMAL(18,2) NOT NULL,
    "open_price" DECIMAL(18,2) NOT NULL,
    "high_price" DECIMAL(18,2) NOT NULL,
    "low_price" DECIMAL(18,2) NOT NULL,
    "volume" INTEGER NOT NULL,
    "open_interest" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "derivatives_pkey" PRIMARY KEY ("derivative_id")
);

-- CreateTable
CREATE TABLE "educational_resources" (
    "resource_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100),
    "date_published" TIMESTAMP(6),

    CONSTRAINT "educational_resources_pkey" PRIMARY KEY ("resource_id")
);

-- CreateTable
CREATE TABLE "etf_holdings" (
    "etf_id" INTEGER,
    "stock_id" INTEGER,
    "shares_held" DECIMAL(18,4),
    "weight" DECIMAL(18,4)
);

-- CreateTable
CREATE TABLE "etf_quotes" (
    "quote_id" SERIAL NOT NULL,
    "etf_id" INTEGER,
    "price" DECIMAL(18,2) NOT NULL,
    "change" DECIMAL(18,2) NOT NULL,
    "percent_change" DECIMAL(18,2) NOT NULL,
    "total_volume" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "etf_quotes_pkey" PRIMARY KEY ("quote_id")
);

-- CreateTable
CREATE TABLE "etfs" (
    "etf_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(50) NOT NULL,
    "management_company" VARCHAR(255),
    "inception_date" DATE,

    CONSTRAINT "etfs_pkey" PRIMARY KEY ("etf_id")
);

-- CreateTable
CREATE TABLE "index_constituents" (
    "index_id" INTEGER,
    "stock_id" INTEGER
);

-- CreateTable
CREATE TABLE "market_indices" (
    "index_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(50) NOT NULL,

    CONSTRAINT "market_indices_pkey" PRIMARY KEY ("index_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "notification_type" VARCHAR(50),
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "quote_id" SERIAL NOT NULL,
    "stock_id" INTEGER,
    "price" DECIMAL(18,2) NOT NULL,
    "change" DECIMAL(18,2) NOT NULL,
    "percent_change" DECIMAL(18,2) NOT NULL,
    "volume" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("quote_id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "stock_id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "market_cap" DECIMAL(18,2),
    "sector" VARCHAR(200),
    "industry" VARCHAR(200),
    "sector_en" VARCHAR(200),
    "industry_en" VARCHAR(200),
    "stock_type" VARCHAR(50),
    "rank" INTEGER DEFAULT 0,
    "rank_source" VARCHAR(200),
    "reason" VARCHAR(255),

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("stock_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "hashed_password" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(255),
    "date_of_birth" DATE,
    "country" VARCHAR(200),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "watchlists" (
    "user_id" INTEGER,
    "stock_id" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "etfs_symbol_key" ON "etfs"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "market_indices_symbol_key" ON "market_indices"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_key" ON "stocks"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "covered_warrants" ADD CONSTRAINT "covered_warrants_underlying_asset_id_fkey" FOREIGN KEY ("underlying_asset_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "derivatives" ADD CONSTRAINT "derivatives_underlying_asset_id_fkey" FOREIGN KEY ("underlying_asset_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "etf_holdings" ADD CONSTRAINT "etf_holdings_etf_id_fkey" FOREIGN KEY ("etf_id") REFERENCES "etfs"("etf_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "etf_holdings" ADD CONSTRAINT "etf_holdings_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "etf_quotes" ADD CONSTRAINT "etf_quotes_etf_id_fkey" FOREIGN KEY ("etf_id") REFERENCES "etfs"("etf_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "index_constituents" ADD CONSTRAINT "index_constituents_index_id_fkey" FOREIGN KEY ("index_id") REFERENCES "market_indices"("index_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "index_constituents" ADD CONSTRAINT "index_constituents_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("stock_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
