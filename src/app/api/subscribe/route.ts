// ====================
// FILE: src/app/api/subscribe/route.ts
// ====================
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service provider
    // Examples below for different services:

    // ===== OPTION 1: Mailchimp =====
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
    // 
    // const response = await fetch(
    //   `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email_address: email,
    //       status: 'subscribed',
    //     }),
    //   }
    // );

    // ===== OPTION 2: SendGrid =====
    // const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    // const SENDGRID_LIST_ID = process.env.SENDGRID_LIST_ID;
    // 
    // const response = await fetch(
    //   'https://api.sendgrid.com/v3/marketing/contacts',
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       list_ids: [SENDGRID_LIST_ID],
    //       contacts: [{ email }],
    //     }),
    //   }
    // );

    // ===== OPTION 3: ConvertKit =====
    // const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    // const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
    // 
    // const response = await fetch(
    //   `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       api_key: CONVERTKIT_API_KEY,
    //       email: email,
    //     }),
    //   }
    // );

    // ===== OPTION 4: Store in Database (Simple approach) =====
    // If you just want to collect emails in your database:
    // 
    // import { db } from '@/lib/db'; // Your database client
    // 
    // await db.newsletter.create({
    //   data: {
    //     email: email,
    //     subscribedAt: new Date(),
    //     status: 'active',
    //   },
    // });

    // For now, we'll just log it and return success
    console.log("Newsletter subscription:", email);

    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully subscribed to newsletter!" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}