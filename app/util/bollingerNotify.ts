import { calculateBollingerBands, Quote } from '@/app/util/bollingerBands';
import transporter from '@/lib/mail'; 
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

async function sendEmail(userId: string, message: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user || !user.email) {
      throw new Error('User email not found');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Stock Notification',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Unable to send email');
  }
}

async function saveNotification(userId: string, stockSymbol: string, message: string) {
  try {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        stockSymbol,
        message,
      },
    });

    if (existingNotification) {
      console.log('Notification with the same message already exists');
      return { success: true, message: 'Notification with the same message already exists' };
    }

    await prisma.notification.create({
      data: {
        userId,
        stockSymbol,
        message,
        createdAt: new Date(),
      },
    });

    await sendEmail(userId, message);
    console.log('Notification saved and email sent successfully');
    return { success: true, message: 'Notification saved successfully' };
  } catch (error) {
    console.error('Error saving notification:', error);
    throw new Error('Unable to save notification');
  }
}

export async function notifyBollingerCross(
  stockSymbol: string,
  quotes: Quote[],
  userId: string,
  followDate: Date
) {
  const { sma, upperBand, lowerBand } = calculateBollingerBands(quotes);

  const messages: string[] = [];
  let previousPrice = quotes[0].close;

  for (const quote of quotes) {
    if (quote.date < followDate) continue;

    const currentPrice = quote.close;
    const index = quotes.findIndex(q => q.date.getTime() === quote.date.getTime());

    if (index === -1) continue;

    const currentUpperBand = upperBand[index];
    const currentLowerBand = lowerBand[index];

    if (currentPrice > currentUpperBand && previousPrice <= currentUpperBand) {
      messages.push(`The stock ${stockSymbol} crossed above the upper Bollinger Band on ${quote.date.toISOString().split('T')[0]}. Current price: ${currentPrice}.`);
    } else if (currentPrice < currentLowerBand && previousPrice >= currentLowerBand) {
      messages.push(`The stock ${stockSymbol} crossed below the lower Bollinger Band on ${quote.date.toISOString().split('T')[0]}. Current price: ${currentPrice}.`);
    }

    previousPrice = currentPrice;
  }

  if (messages.length > 0) {
    try {
      for (const message of messages) {
        await saveNotification(userId, stockSymbol, message);
      }
      return NextResponse.json({ success: true, message: 'Notifications sent successfully' });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save notifications' });
    }
  }

  return NextResponse.json({ success: false, message: 'No significant Bollinger Band crossovers detected' });
}
