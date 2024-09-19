import Link from "next/link";
import React from "react";
import Appbar from "@/app/components/Appbar";
import Each from "./Each";
import { categories } from "@/utils/constants";

export const dynamic = "force-dynamic";

const Header: React.FC = () => {
  return (
    <header className="bg-black shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
            aria-label="Home"
          >
            EAGLE EYE
          </Link>
          <nav className="ml-10 space-x-4">
            <input
              type="text"
              placeholder="Sreach"
              className="px-1 py-1 rounded-lg bg-input text-input-foreground"
              aria-label="Sreach"
            />
            <Each
              of={categories}
              render={(category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="text-yellow-500 hover:text-white"
                >
                  {category.name}
                </Link>
              )}
            />
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/pay"
            className="px-2 py-1 text-black bg-white text-black rounded-full font-bold"
          >
            Explore Premium
          </Link>
          <Appbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
