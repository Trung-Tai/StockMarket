import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '../../lib/prisma';
import cron from 'node-cron';
import { notifyBollingerCross } from '../util/bollingerNotify';

async function getStockSymbolsFromWatchlist(userId: string) {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: userId },
      select: {
        stockSymbol: true,
      },
    });
    return watchlist.map(item => item.stockSymbol);
  } catch (error) {
    console.error('Error fetching stock symbols from watchlist:', error);
    return [];
  }
}

async function runNotification() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      console.error('User is not authenticated or user ID is missing');
      return;
    }

    const userId = session.user.id;
    const stockSymbols = await getStockSymbolsFromWatchlist(userId);

    for (const stockSymbol of stockSymbols) {
      const quotes = await prisma.quote.findMany({
        where: { symbol: stockSymbol },
        orderBy: { date: 'asc' },
      });

      if (quotes.length === 0) continue;

      const followDate = quotes[0].date;

      await notifyBollingerCross(stockSymbol, quotes, userId, followDate);
    }
  } catch (error) {
    console.error('Error running notification:', error);
  }
}

cron.schedule('0 * * * *', () => {
  console.log('Running notifyBollingerCross...');
  runNotification().catch(err => console.error('Error running notification in cron job:', err));
});

runNotification().catch(err => console.error('Error running notification in cron job:', err));
