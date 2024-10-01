// @/components/razorpay/Buy.jsx

"use client";

import { BadgeIndianRupee } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

const Buy = ({ makePayment }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          makePayment({ productId: "example_ebook" });
        }}
        disabled={isLoading}
        className={`flex h-[36px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50  text-sm font-medium hover:bg-green-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "text-white-600"
        }`}
      >
        <BadgeIndianRupee className="mr-2 h-4 w-4" />
        {isLoading ? "Processing..." : "Buy Credits"}
      </Button>
    </>
  );
};

export default Buy;
