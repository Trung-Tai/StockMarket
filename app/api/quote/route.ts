import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    const filters: any = {};

    if (groupId) {
      filters.groups = {
        some: {
          groupId: parseInt(groupId),
        },
      };
    }

    const stockData = await prisma.stock.findMany({
      where: filters,
      select: {
        symbol: true,
        name: true,
        groups: {
          select: {
            group: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log('Data fetched:', stockData);
    if (!stockData.length) {
      console.log('No data found for the specified group');
    }
    const formattedData = stockData.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      groupName: stock.groups.length > 0 ? stock.groups.map(g => g.group.name).join(', ') : 'No Group',
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error: (error as Error).message }, { status: 500 });
  }
}

