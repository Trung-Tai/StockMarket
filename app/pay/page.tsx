import React from "react";
import Payment from "../components/Payment";

const PaymentPage: React.FC = () => {
  return (
    <div>
      <Payment
        title="Upgrade now to experience 1 month of the Premium Stock Package for $10."
        description="Only $10/month after. Cancel anytime."
        price="$10"
        afterPrice="$10/month"
        buttonText="Get Premium now"
        termsLink="#"
        plans={[
          {
            title: "Pro",
            subtitle: "$5.00 for 1 week",
            price: "",
            details: [
              "1 mobile-only Premium account",
              "Offline listening of up to 30 songs on 1 device",
              "One-time payment",
              "Basic audio quality",
            ],
            buttonText: "Get Pro",
            termsLink: "#",
          },
          {
            title: "Premium",
            subtitle: "$10 per month",
            price: "",
            details: [
              "6 Premium accounts",
              "Family Mix: a playlist for your family",
              "Block explicit music",
              "Cancel anytime",
            ],
            buttonText: "Get Premium",
            termsLink: "#",
          },
          {
            title: "Diamond",
            subtitle: "$15.00 per month",
            price: "",
            details: [
              "2 Premium accounts",
              "For couples who live together",
              "Cancel anytime",
            ],
            buttonText: "Get Diamond",
            termsLink: "#",
          },
        ]}
      />
    </div>
  );
};

export default PaymentPage;
