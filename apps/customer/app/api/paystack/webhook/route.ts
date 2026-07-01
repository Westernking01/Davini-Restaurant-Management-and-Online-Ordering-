import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaymentAction } from "@/actions/payment-actions";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("WEBHOOK_ERROR: PAYSTACK_SECRET_KEY is not defined.");
      return new NextResponse("Server Configuration Error", { status: 500 });
    }

    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return new NextResponse("Missing signature header", { status: 400 });
    }

    const rawBody = await req.text();
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.error("WEBHOOK_ERROR: Invalid Paystack signature.");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success" && event.data?.reference) {
      const reference = event.data.reference;
      console.log(`Received Paystack webhook for reference: ${reference}`);

      // Call verifyPaymentAction to update payments and orders tables securely
      const result = await verifyPaymentAction(reference);
      if (!result.success) {
        console.error(`Webhook verification processing failed for reference ${reference}:`, result.errorMessage);
      } else {
        console.log(`Successfully verified and confirmed order ${result.orderId} via webhook.`);
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("WEBHOOK_UNEXPECTED_ERROR:", err.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
