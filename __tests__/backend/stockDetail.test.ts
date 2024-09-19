import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GET } from "@/app/api/stockDetail/[symbol]/route";

jest.mock("@/lib/prisma", () => {
  return {
    stock: {
      findUnique: jest.fn(),
    },
  };
});

describe("GET function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted stock data for a given symbol and range", async () => {
    const req = {
      url: "http://localhost/api/stocks/AAPL?range=7",
    } as unknown as NextRequest;

    const mockData = {
      symbol: "AAPL",
      name: "Apple Inc.",
      quotes: [
        {
          date: new Date(),
          open: 145.0,
          close: 150.0,
          high: 151.0,
          low: 144.0,
          volume: BigInt(100000),
        },
      ],
      company: { name: "Apple Inc.", industry: "Technology" },
    };

    (prisma.stock.findUnique as jest.Mock).mockResolvedValue(mockData);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      symbol: "AAPL",
      name: "Apple Inc.",
      quotes: [
        {
          date: mockData.quotes[0].date.toISOString(),
          open: 145.0,
          close: 150.0,
          high: 151.0,
          low: 144.0,
          volume: "100000",
        },
      ],
      company: { name: "Apple Inc.", industry: "Technology" },
    });
  });

  it("should return 404 if stock not found", async () => {
    const req = {
      url: "http://localhost/api/stocks/INVALID?range=7",
    } as unknown as NextRequest;

    (prisma.stock.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse).toEqual({ error: "Stock not found" });
  });

  it("should return 400 if symbol is invalid", async () => {
    const req = {
      url: "http://localhost/api/stocks/",
    } as unknown as NextRequest;

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ error: "Invalid stock symbol" });
  });

  it("should return 500 if there is an error fetching data", async () => {
    const req = {
      url: "http://localhost/api/stocks/AAPL?range=7",
    } as unknown as NextRequest;

    const mockError = new Error("Database error");

    (prisma.stock.findUnique as jest.Mock).mockRejectedValue(mockError);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      error: "Error fetching stock data: Error: Database error",
    });
  });
});
