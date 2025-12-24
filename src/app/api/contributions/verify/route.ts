// ============================================
// FILE: src/app/api/contributions/verify/route.ts
// ✅ Verifies Razorpay payment signature & saves contribution
// ============================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createContribution, sendContributionThankYou } from "@/lib/supabase/contribution-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      user_id,
      user_name,
      user_email,
      message
    } = body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // ============================================
    // VERIFY SIGNATURE (Security Critical!)
    // ============================================
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Payment signature verification failed");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    console.log("✅ Payment signature verified");

    // ============================================
    // SAVE CONTRIBUTION TO DATABASE
    // ============================================
    const { data: contribution, error: dbError } = await createContribution({
      user_id: user_id || null,
      user_name,
      user_email,
      amount: Math.round(amount), // Ensure integer
      currency: "INR",
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      message: message || null,
      status: "success"
    });

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save contribution" },
        { status: 500 }
      );
    }

    console.log("✅ Contribution saved to database");

    // ============================================
    // SEND THANK YOU NOTIFICATION
    // ============================================
    if (user_id) {
      try {
        await sendContributionThankYou(user_id, user_name, amount);
        console.log("✅ Thank you notification sent");
      } catch (notifError) {
        console.error("⚠️ Notification failed (non-critical):", notifError);
        // Don't fail the request if notification fails
      }
    }

    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      contribution_id: contribution?.id,
      amount,
      payment_id: razorpay_payment_id
    });

  } catch (error: any) {
    console.error("❌ Payment verification error:", error);

    return NextResponse.json(
      { 
        error: "Payment verification failed",
        message: error.message 
      },
      { status: 500 }
    );
  }
}