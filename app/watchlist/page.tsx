import Header from "@/app/components/Header";
import Watchlist from "@/app/components/watchlist";
import React from "react";

const page: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Watchlist />
      </main>
    </div>
  );
};

export default page;
