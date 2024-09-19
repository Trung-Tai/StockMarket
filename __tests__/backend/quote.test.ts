import { NextRequest, NextResponse } from "next/server";
import { GET } from "@/app/api/quote/route";
import prisma from "@/lib/prisma";

// Mock the prisma client
jest.mock("@/lib/prisma", () => ({
  stock: {
    findMany: jest.fn(),
  },
}));

describe("GET function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted stock data for a given groupId", async () => {
    const req = {
      url: "http://localhost/api/stocks?groupId=1",
    } as NextRequest;

    const mockData = [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        groups: [{ group: { name: "Tech" } }],
      },
    ];

    (prisma.stock.findMany as jest.Mock).mockResolvedValue(mockData);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        groupName: "Tech",
      },
    ]);
  });

  it('should return "No Group" if the stock is not part of any group', async () => {
    const req = {
      url: "http://localhost/api/stocks",
    } as NextRequest;

    const mockData = [
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        groups: [],
      },
    ];

    (prisma.stock.findMany as jest.Mock).mockResolvedValue(mockData);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        groupName: "No Group",
      },
    ]);
  });

  it("should handle empty result set gracefully", async () => {
    const req = {
      url: "http://localhost/api/stocks?groupId=1",
    } as NextRequest;

    const mockData: any[] = [];

    (prisma.stock.findMany as jest.Mock).mockResolvedValue(mockData);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([]);
  });

  it("should return status 500 if there is an error fetching data", async () => {
    const req = {
      url: "http://localhost/api/stocks",
    } as NextRequest;

    const mockError = new Error("Database error");

    (prisma.stock.findMany as jest.Mock).mockRejectedValue(mockError);

    const response = await GET(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      message: "Error fetching data",
      error: "Database error",
    });
  });
});
