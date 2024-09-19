import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sePayApiUrl = 'https://my.sepay.vn/userapi/transactions/list';

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const response = await fetch(sePayApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.API_SEPAY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error fetching transaction data from SePay API');
    }

    const data = await response.json();

    console.log('Data returned from SePay API:', data.transactions);

    if (!data.transactions) {
      throw new Error('Invalid data returned from SePay API');
    }

    let totalAmount = 0;
    let mostRecentTransaction: any = null;

    function extractMoMoUserId(transactionContent: string): string {
      const parts = transactionContent.split('-');
      if (parts.length > 1) {
        return parts[1].trim();
      }
      throw new Error('Invalid MoMo transaction_content format');
    }

    function extractBankUserId(transactionContent: string): string {
      const parts = transactionContent.split('.');
      if (parts.length > 3) {
        return parts[3].trim();
      }
      throw new Error('Invalid bank transaction_content format');
    }

    async function processMoMoTransaction(transaction: any) {
      if (parseFloat(transaction.amount_in) > 0) {
        try {
          const transactionUserId = extractMoMoUserId(transaction.transaction_content);
          console.log('Extracted MoMo User ID:', transactionUserId);

          if (transactionUserId === userId) {
            totalAmount += parseFloat(transaction.amount_in);

            if (!mostRecentTransaction || new Date(transaction.transaction_date) > new Date(mostRecentTransaction.transaction_date)) {
              mostRecentTransaction = transaction;
            }

            const existingTransaction = await prisma.transaction.findFirst({
              where: {
                userId: userId,
                transactionDate: new Date(transaction.transaction_date),
              },
            });

            if (!existingTransaction) {
              return {
                userId: userId,
                gateway: transaction.bank_brand_name,
                transactionDate: new Date(transaction.transaction_date),
                accountNumber: transaction.account_number,
                subAccount: transaction.sub_account,
                amountIn: parseFloat(transaction.amount_in),
                amountOut: parseFloat(transaction.amount_out),
                accumulated: parseFloat(transaction.accumulated),
                code: transaction.code,
                transactionContent: transaction.transaction_content,
                referenceNumber: transaction.reference_number,
                body: JSON.stringify(transaction),
                createdAt: new Date(),
              };
            }
          }
        } catch (error) {
          console.error('Error extracting MoMo userId from transaction_content:', error);
        }
      }
    }

    async function processBankTransaction(transaction: any) {
      if (parseFloat(transaction.amount_in) > 0) {
        try {
          const transactionUserId = extractBankUserId(transaction.transaction_content);
          console.log('Extracted Bank User ID:', transactionUserId);

          if (transactionUserId === userId) {
            totalAmount += parseFloat(transaction.amount_in);

            if (!mostRecentTransaction || new Date(transaction.transaction_date) > new Date(mostRecentTransaction.transaction_date)) {
              mostRecentTransaction = transaction;
            }

            const existingTransaction = await prisma.transaction.findFirst({
              where: {
                userId: userId,
                transactionDate: new Date(transaction.transaction_date),
              },
            });

            if (!existingTransaction) {
              return {
                userId: userId,
                gateway: transaction.bank_brand_name,
                transactionDate: new Date(transaction.transaction_date),
                accountNumber: transaction.account_number,
                subAccount: transaction.sub_account,
                amountIn: parseFloat(transaction.amount_in),
                amountOut: parseFloat(transaction.amount_out),
                accumulated: parseFloat(transaction.accumulated),
                code: transaction.code,
                transactionContent: transaction.transaction_content,
                referenceNumber: transaction.reference_number,
                body: JSON.stringify(transaction),
                createdAt: new Date(),
              };
            }
          }
        } catch (error) {
          console.error('Error extracting bank userId from transaction_content:', error);
        }
      }
    }

    const momoTransactionsToSave = await Promise.all(
      data.transactions.map(processMoMoTransaction)
    );

    const validMoMoTransactionsToSave = momoTransactionsToSave.filter(
      (transaction) => transaction !== undefined
    );

    if (validMoMoTransactionsToSave.length > 0) {
      try {
        await prisma.transaction.createMany({
          data: validMoMoTransactionsToSave,
        });
        console.log('Saved MoMo Transactions:', validMoMoTransactionsToSave);
      } catch (error) {
        console.error('Error saving MoMo transactions:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to save MoMo transactions' },
          { status: 500 }
        );
      }
    }

    const bankTransactionsToSave = await Promise.all(
      data.transactions.map(processBankTransaction)
    );

    const validBankTransactionsToSave = bankTransactionsToSave.filter(
      (transaction) => transaction !== undefined
    );

    if (validBankTransactionsToSave.length > 0) {
      try {
        await prisma.transaction.createMany({
          data: validBankTransactionsToSave,
        });
        console.log('Saved Bank Transactions:', validBankTransactionsToSave);
      } catch (error) {
        console.error('Error saving bank transactions:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to save bank transactions' },
          { status: 500 }
        );
      }
    }

    let accountTypeId: number | undefined;
    let accountTypeName = '';

    if (mostRecentTransaction) {
      const mostRecentAmount = parseFloat(mostRecentTransaction.amount_in);

      if (mostRecentAmount == 15000) {
        accountTypeName = 'Diamond';
      } else if (mostRecentAmount == 10000) {
        accountTypeName = 'Premium';
      } else if (mostRecentAmount == 5000) {
        accountTypeName = 'Pro';
      }

      if (accountTypeName) {
        const accountType = await prisma.accountType.findUnique({
          where: { name: accountTypeName },
        });

        if (!accountType) {
          return NextResponse.json(
            { success: false, message: 'Account type not found' },
            { status: 404 }
          );
        }
        accountTypeId = accountType.id;
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              accountType: {
                connect: { id: accountTypeId },
              },
            },
          });

          console.log('Account type updated:', accountTypeName);
        } catch (error) {
          console.error('Error updating user account type:', error);
          return NextResponse.json(
            { success: false, message: 'Failed to update user account type' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      transactions: [...validMoMoTransactionsToSave, ...validBankTransactionsToSave],
      mostRecentTransaction
    });
  } catch (error) {
    console.error('Error processing transaction data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
