import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, stockSymbol } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const stock = await prisma.stock.findUnique({ where: { symbol: stockSymbol } });

    if (!user || !stock) {
      return NextResponse.json({ error: 'User or stock not found' }, { status: 400 });
    }

    const existingWatchlistEntry = await prisma.watchlist.findUnique({
      where: {
        userId_stockSymbol: {
          userId,
          stockSymbol,
        },
      },
    });

    if (!existingWatchlistEntry) {
      return NextResponse.json({ error: 'Stock is not in watchlist' }, { status: 400 });
    }

    await prisma.watchlist.delete({
      where: {
        userId_stockSymbol: {
          userId,
          stockSymbol,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
