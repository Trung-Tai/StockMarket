"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CombinedChart from "./charts/CombinedChart";

interface StockQuoteData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}

interface Company {
  name: string;
  industry: string;
}

interface StockDetailData {
  symbol: string;
  name: string;
  quotes: StockQuoteData[];
  company: Company;
  totalQuotes: number;
  totalPages: number;
  currentPage: number;
}

const Stock: React.FC = () => {
  const { symbol } = useParams();
  const [data, setData] = useState<StockDetailData | null>(null);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);

  const quotesPerPage = 10;

  useEffect(() => {
    if (!symbol) {
      console.log("Stock symbol not found in URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        console.log("Fetching data for symbol:", symbol);
        const response = await fetch(
          `/api/stockDetail/${symbol}?range=${range}&page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Data fetched:", result);

        // Giả sử `quotes` luôn có dữ liệu
        const filteredQuotes = result.quotes.filter((item: StockQuoteData) => {
          const date = new Date(item.date);
          const day = date.getDay();
          return day >= 1 && day <= 5;
        });

        setData({ ...result, quotes: filteredQuotes });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range, currentPage]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>No data available</p>;

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentQuotes = data.quotes.slice(
    (currentPage - 1) * quotesPerPage,
    currentPage * quotesPerPage
  );

  const convertedQuotes = data.quotes.map((quote) => ({
    ...quote,
    volume: Number(quote.volume),
  }));

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          {data.name} ({data.symbol})
        </h2>

        <div className="mb-4">
          {["3", "7", "10", "30"].map((rangeOption) => (
            <button
              key={rangeOption}
              className={`py-2 px-4 mx-1 rounded ${
                range === rangeOption ? "bg-orange-500" : "bg-gray-600"
              } text-white`}
              onClick={() => handleRangeChange(rangeOption)}
            >
              {rangeOption === "30" ? "1M" : `${rangeOption}D`}
            </button>
          ))}
        </div>

        <div
          className="mt-4 bg-black"
          style={{ width: "100%", height: "600px" }}
        >
          <CombinedChart data={convertedQuotes} range={range} />
        </div>
      </div>
    </div>
  );
};

export default Stock;
