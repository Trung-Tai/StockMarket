import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SePayPayment = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const router = useRouter();

  const userId = session?.user?.id;
  const amount =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("paymentAmount") || "5000")
      : 5000;

  useEffect(() => {
    if (timeLeft > 0 && !paymentSuccess) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !paymentSuccess) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [timeLeft, paymentSuccess, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const initiateSePayPayment = async () => {
    try {
      setLoading(true);

      const apiUrl = `/api/sepay?userId=${userId}&amount=${amount}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setPaymentUrl(result.paymentUrl);
        const transactions = result.transactions;

        if (transactions && transactions.length > 0) {
          setPaymentSuccess(true);
          alert("Payment successful, your account has been updated.");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setErrorMessage("Payment failed. Please try again.");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } else {
        setErrorMessage("Payment initialization failed: " + result.message);
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred during payment initiation: " +
          (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-10 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-semibold mb-6">Bank Transfer Payment</h1>

        {loading ? (
          <div className="text-center">Processing...</div>
        ) : paymentSuccess ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-green-400 mb-6">
              Congratulations! You have successfully upgraded!
            </h2>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Return to Home
            </button>
          </div>
        ) : paymentUrl ? (
          <div className="text-center">
            <a
              href={paymentUrl}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Proceed to Payment
            </a>
          </div>
        ) : errorMessage ? (
          <div className="text-red-500 text-center">{errorMessage}</div>
        ) : (
          <>
            <div className="flex">
              <div className="w-1/2 p-4 border-r border-green-700">
                <h2 className="text-lg font-medium mb-4">
                  Method 1: Scan QR Code
                </h2>
                <Image
                  src={`https://qr.sepay.vn/img?bank=MBBank&acc=1470154856786&template=compact&amount=${amount}&des=${userId}`}
                  alt="SePay QR Code"
                  width={200}
                  height={200}
                />
              </div>
              <div className="w-1/2 p-4">
                <h2 className="text-lg font-medium mb-4">
                  Method 2: Manual Bank Transfer
                </h2>
                <p>
                  <strong>Bank:</strong> MBBank
                </p>
                <p>
                  <strong>Beneficiary:</strong> VO LE QUANG
                </p>
                <p>
                  <strong>Account Number:</strong> 0977273853
                </p>
                <p>
                  <strong>Amount:</strong> {amount} VND
                </p>
                <p>
                  <strong>Transfer Description:</strong> DHC
                </p>
              </div>
            </div>

            {!paymentSuccess && (
              <>
                <div className="mt-4 p-3 border border-blue-700 rounded-lg text-center">
                  <p>Time Remaining:</p>
                  <p className="text-xl font-bold">{formatTime(timeLeft)}</p>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={initiateSePayPayment}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:bg-green-400"
              >
                {loading ? "Processing..." : "Initiate Payment"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SePayPayment;
