"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import "@/styles/globals.css";
import { useSession } from "next-auth/react";

interface PaymentProps {
  title: string;
  description: string;
  price: string;
  afterPrice: string;
  buttonText: string;
  termsLink: string;
  plans: Plan[];
}

interface Plan {
  title: string;
  subtitle: string;
  price: string;
  details: string[];
  buttonText: string;
  termsLink: string;
}

const Payment: React.FC<PaymentProps> = ({
  price,
  afterPrice,
  buttonText,
  termsLink,
  plans,
}) => {
  const plansSectionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScrollToPlans = () => {
    if (plansSectionRef.current) {
      plansSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetPremium = (planTitle: string) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    let amount = 0;

    switch (planTitle) {
      case "Pro":
        amount = 5000;
        break;
      case "Premium":
        amount = 10000;
        break;
      case "Diamond":
        amount = 15000;
        break;
      default:
        console.log("Unknown plan");
        return;
    }

    localStorage.setItem("paymentAmount", amount.toString());

    router.push("/sepay");
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center p-12 rounded-lg shadow-md mb-6 w-full">
          <h1 className="text-4xl font-bold mb-4">
            Try 1 month of Premium for {price}.
          </h1>
          <p className="text-xl mb-6">
            Only {afterPrice}/month after. Cancel anytime.
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className="bg-white text-black hover:bg-gray-200 py-3 px-6 rounded-full font-semibold"
              onClick={() => handleGetPremium("Premium")}
            >
              Get Premium Now
            </button>
            <button
              className="border border-white text-white hover:bg-white hover:text-black py-3 px-6 rounded-full"
              onClick={handleScrollToPlans}
            >
              View all plans
            </button>
          </div>
        </div>

        <div className="bg-gray-800 text-white text-center p-8 rounded-lg shadow-md mb-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Easy and fast payment.</h2>
          <p className="text-lg mb-6">
            Choose a flexible and optimal investment plan to track the stock
            market accurately and efficiently.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Image
              src="/images/Sepay.png"
              alt="Sepay"
              width={150}
              height={90}
            />
          </div>
        </div>

        <div
          ref={plansSectionRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg bg-gray-800 border-2  ${
                plan.title === "Pro"
                  ? "border-pro"
                  : plan.title === "Premium"
                  ? "border-premium"
                  : "border-diamond"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <h4 className="text-lg font-semibold mb-2 text-gray-300">
                {plan.subtitle}
              </h4>
              <p className="text-lg mb-4 text-white">{plan.price}</p>
              <ul className="mb-4 text-gray-400">
                {plan.details.map((detail, i) => (
                  <li key={i} className="mb-1">
                    {detail}
                  </li>
                ))}
              </ul>
              <button
                className={`py-2 px-4 rounded-full font-semibold ${
                  plan.title === "Pro"
                    ? "btn-pro"
                    : plan.title === "Premium"
                    ? "btn-premium"
                    : "btn-diamond"
                }`}
                onClick={() => handleGetPremium(plan.title)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
