import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyBollingerCross } from '@/app/util/bollingerNotify';

export const dynamic = 'force-dynamic';

async function getStockSymbolsFromWatchlist(userId: string) {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: userId },
      select: {
        stockSymbol: true,
        createdAt: true,
      },
    });
    return watchlist;
  } catch (error) {
    console.error('Error fetching stock symbols from watchlist:', error);
    return [];
  }
}

async function runNotification(userId: string) {
  try {
    const watchlistItems = await getStockSymbolsFromWatchlist(userId);

    for (const { stockSymbol, createdAt } of watchlistItems) {
      const quotes = await prisma.quote.findMany({
        where: { 
          symbol: stockSymbol,
          date: {
            gte: createdAt,
          }
        },
        orderBy: { date: 'asc' },
      });

      if (quotes.length === 0) continue;

      await notifyBollingerCross(stockSymbol, quotes, userId, createdAt);
    }
  } catch (error) {
    console.error('Error running notification:', error);
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedAuthHeader = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || authHeader.trim() !== expectedAuthHeader) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    for (const user of users) {
      await runNotification(user.id);
    }

    return NextResponse.json({ message: 'Cron job executed successfully for all users.' });
  } catch (error) {
    console.error('Error executing cron job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
