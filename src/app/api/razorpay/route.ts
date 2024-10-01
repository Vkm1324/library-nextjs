//@/app/api/razorpay/route.js
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { nanoid } from "nanoid";
import { env } from "process";

// Initialize Razorpay instance with your test key
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function GET(req: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
 
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Razorpay options for creating an order
  const payment_capture = 1;
  const amount = 10 * 100; // amount in paisa (₹10.00)
  const currency = "INR";

  const options = {
    amount: amount.toString(),
    currency,
    receipt: nanoid(),
    payment_capture,
    notes: {
      paymentFor: "testingDemo",
      userId: userId, // dynamically set the userId from query param
      productId: "P100",
    },
  };

  try {
    // Create an order in Razorpay
    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Return the order details in response
    return NextResponse.json({ msg: "success", order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Handle POST requests
  const body = await req.json();
  return NextResponse.json({ msg: body });
}
