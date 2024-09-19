import React from "react";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="bg-black py-8 sm:py-4 text-center text-sm text-white hover:text-white">
        &copy; Copyright {new Date().getFullYear()} EAGLE EYE. All rights
        reserved
      </div>
    </footer>
  );
};

export default Footer;
