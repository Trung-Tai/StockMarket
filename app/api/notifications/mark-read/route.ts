import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedNotifications = await prisma.notification.updateMany({
      where: { userId: userId, read: false },
      data: { read: true }
    });

    return NextResponse.json({ message: 'Notifications marked as read', count: updatedNotifications.count });
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
