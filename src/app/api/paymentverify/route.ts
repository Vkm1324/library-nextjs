//@/app/api/paymentverify/route.ts

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { UserRepository } from "@/lib/user-management/user.repository"
 
export async function POST(req, res) {
  try {
    // Parse the request JSON
    console.log("++++++++++++", await req.json);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Log the received IDs
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Received body:", body);

    // Ensure environment variables are loaded
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_APT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    // If the signature is valid, proceed with saving the payment info
    if (isAuthentic) {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

    console.log("Payment verification successful", userId);
      const userRepo = new UserRepository();
      const user = await userRepo.getById(+userId!);
      const creditValue = user!.credits + 10;
      await userRepo.updateCredit(+userId!, creditValue);

      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      console.error("Payment verification failed===========");
      return NextResponse.json({ message: "fail" }, { status: 400 });
    }
  } catch (error :unknown) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}