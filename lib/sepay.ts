import axios from 'axios';

const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN;

export async function createPayment({ bank, beneficiary, accountNumber, amount, currency, description, returnUrl }: {
  bank: string;
  beneficiary: string;
  accountNumber: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
}) {
  try {
    const response = await axios.post('https://api.sepay.vn/v1/payment', {
      bank,
      beneficiary,
      accountNumber,
      amount,
      currency,
      description,
      returnUrl,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SEPAY_API_TOKEN}`,
      },
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create payment');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating payment:', error.message);
      throw new Error(error.message || 'An unknown error occurred');
    } else {
      console.error('Unknown error', error);
      throw new Error('An unknown error occurred');
    }
  }
}
