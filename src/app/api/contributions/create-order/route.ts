// ============================================
// FILE: src/app/api/contributions/create-order/route.ts
// 🎯 Creates Razorpay order for contribution
// ============================================

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { amount, currency = "INR", name, email } = body;

    // Validation
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be at least ₹1" },
        { status: 400 }
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create Razorpay order options
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay requires smallest currency unit)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        contributor_name: name,
        contributor_email: email,
        type: "contribution",
        platform: "vaidehi"
      }
    };

    console.log("Creating Razorpay order with options:", options);

    // Create order via Razorpay API
    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created successfully:", order.id);

    // Return success response
    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error("❌ Razorpay order creation failed:", error);

    // Handle specific Razorpay errors
    if (error.statusCode === 401) {
      return NextResponse.json(
        { 
          error: "Razorpay authentication failed. Please check your API keys.",
          message: "Invalid API credentials" 
        },
        { status: 500 }
      );
    }

    if (error.statusCode === 400) {
      return NextResponse.json(
        { 
          error: "Invalid request to Razorpay",
          message: error.error?.description || error.message 
        },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        error: "Failed to create payment order",
        message: error.message || "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}