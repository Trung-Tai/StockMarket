import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PaymentSuccess = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const { transactionId, status } = router.query;
    setTransactionId(transactionId as string);
    setStatus(status as string);

    if (status === 'success') {
      // Xác nhận thanh toán từ phía máy chủ
      fetch('/api/sepay/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            setErrorMessage('Failed to confirm payment. Please try again later.');
          }
        })
        .catch(error => {
          setErrorMessage('An error occurred while confirming the payment: ' + (error as Error).message);
        });
    } else {
      setErrorMessage('Payment failed. Please try again.');
    }
  }, [router.query]);

  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-10 rounded-lg shadow-lg max-w-2xl w-full text-center">
        {status === 'success' ? (
          <>
            <h1 className="text-3xl font-semibold text-green-400 mb-6">Congratulations! You have successfully upgraded!</h1>
            <p>Transaction ID: {transactionId}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-red-400 mb-6">Transaction Failed</h1>
            <p>{errorMessage}</p>
          </>
        )}
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
