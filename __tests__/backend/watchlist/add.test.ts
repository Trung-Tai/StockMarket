import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { POST } from "@/app/api/watchlist/add/route";
const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    stock: {
      findUnique: jest.fn(),
    },
    watchlist: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe("POST /api/watchlist/add/route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully add to the watchlist", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    const mockStock = { symbol: "AAPL", name: "Apple Inc." };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.stock.findUnique as jest.Mock).mockResolvedValue(mockStock);
    (prisma.watchlist.findUnique as jest.Mock).mockResolvedValue(null); 

    const req = {
      json: jest.fn().mockResolvedValue({ userId: 1, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.stock.findUnique).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
    });
    expect(prisma.watchlist.findUnique).toHaveBeenCalledWith({
      where: { userId_stockSymbol: { userId: 1, stockSymbol: "AAPL" } },
    });
    expect(prisma.watchlist.create).toHaveBeenCalledWith({
      data: { userId: 1, stockSymbol: "AAPL" },
    });
  });

  it("should return 400 if userId or stockSymbol is missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ userId: null, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Missing userId or stockSymbol" });
  });

  it("should return 404 if user is not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stock.findUnique as jest.Mock).mockResolvedValue({
      symbol: "AAPL",
      name: "Apple Inc.",
    });

    const req = {
      json: jest.fn().mockResolvedValue({ userId: 1, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ error: "User not found" });
  });

  it("should return 404 if stock is not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: "John Doe",
    });
    (prisma.stock.findUnique as jest.Mock).mockResolvedValue(null);

    const req = {
      json: jest.fn().mockResolvedValue({ userId: 1, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ error: "Stock not found" });
  });

  it("should return 400 if stock is already in watchlist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: "John Doe",
    });
    (prisma.stock.findUnique as jest.Mock).mockResolvedValue({
      symbol: "AAPL",
      name: "Apple Inc.",
    });
    (prisma.watchlist.findUnique as jest.Mock).mockResolvedValue({
      userId: 1,
      stockSymbol: "AAPL",
    });

    const req = {
      json: jest.fn().mockResolvedValue({ userId: 1, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Stock is already in watchlist" });
  });

  it("should return 500 if there is an internal error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({ userId: 1, stockSymbol: "AAPL" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: "Internal server error" });
  });
});
