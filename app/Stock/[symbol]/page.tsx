import Header from "@/app/components/Header";
import Stock from "@/app/components/Stock";
import React from "react";

const page: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Stock />
      </main>
    </div>
  );
};

export default page;
