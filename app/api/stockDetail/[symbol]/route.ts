import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const symbol = url.pathname.split('/').pop();
  const range = url.searchParams.get('range') || '7'; 

  console.log('Symbol:', symbol);
  console.log('Range:', range);

  if (symbol) {
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (range) {

        case '3':
          startDate.setDate(endDate.getDate()- 3 );
          break;
        case '7':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '10':
          startDate.setDate(endDate.getDate() - 10);
          break;
        case '30':
          startDate.setDate(endDate.getDate() - 30);
          break;
        default:
          startDate.setDate(endDate.getDate()-3);
      }

      const stock = await prisma.stock.findUnique({
        where: { symbol: symbol },
        include: {
          quotes: {
            where: {
              date: {
                gte: startDate,
                lte: endDate
              }
            },
            orderBy: { date: 'desc' }
          },
          company: true,
        },
      });

      if (!stock) {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      }

      const stockWithStringBigInt = stock.quotes.map((quote) => ({
        ...quote,
        volume: quote.volume.toString(),
      }));

      const response = {
        symbol: stock.symbol,
        name: stock.name,
        quotes: stockWithStringBigInt,
        company: stock.company,
      };

      console.log('Stock Data:', response);
      return NextResponse.json(response);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return NextResponse.json({ error: `Error fetching stock data: ${error}` }, { status: 500 });
    }
  } else {
    console.log('Invalid stock symbol');
    return NextResponse.json({ error: 'Invalid stock symbol' }, { status: 400 });
  }
}
