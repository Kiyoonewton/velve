import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { orderProcessingEmail, orderShippedEmail, orderDeliveredEmail, orderCancelledEmail, orderRefundedEmail } from "@/lib/emails";

// Stripe is initialised lazily inside the handler so the env var is available at runtime

export async function POST(req: NextRequest) {
  const { orderId, status, trackingNumber } = await req.json();

  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // When cancelling, issue a Stripe refund first then store as "refunded"
  if (status === "cancelled") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { data: existing } = await supabase
      .from("orders")
      .select("stripe_payment_id, email, order_number, shipping_name, items, total, id, created_at, discount_amount, shipping_address, shipping_city, shipping_state, shipping_country, shipping_postcode")
      .eq("id", orderId)
      .single();

    if (existing?.stripe_payment_id) {
      try {
        await stripe.refunds.create({ payment_intent: existing.stripe_payment_id });
        console.log(`Stripe refund issued for ${existing.stripe_payment_id}`);
      } catch (err: any) {
        console.error("Stripe refund failed:", err.message);
        // Still cancel the order even if refund fails (e.g. already refunded)
      }
    }

    // Mark as refunded in DB
    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: "refunded" })
      .eq("id", orderId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Send cancellation email immediately — refund confirmation comes later via Stripe webhook
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Your order ${order.order_number} has been cancelled`,
      html: orderCancelledEmail(order),
    });
    console.log(`Cancellation email sent to ${order.email}`);

    return NextResponse.json({ ok: true, order });
  }

  const update: any = { status };
  if (trackingNumber !== undefined) update.tracking_number = trackingNumber || null;

  const { data: order, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const resend = new Resend(process.env.RESEND_API_KEY!);

  if (status === "processing") {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Your order ${order.order_number} is being prepared`,
      html: orderProcessingEmail(order),
    });
    console.log(`Processing email sent to ${order.email}`);
  }

  if (status === "shipped") {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Your order ${order.order_number} has shipped!`,
      html: orderShippedEmail(order),
    });
    console.log(`Shipped email sent to ${order.email}`);
  }

  if (status === "delivered") {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Thank you for your order, ${order.shipping_name.split(" ")[0]}!`,
      html: orderDeliveredEmail(order),
    });
    console.log(`Delivered email sent to ${order.email}`);
  }

  if (status === "refunded") {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Your refund for order ${order.order_number} is being processed`,
      html: orderRefundedEmail(order),
    });
    console.log(`Refunded email sent to ${order.email}`);
  }

  return NextResponse.json({ ok: true, order });
}
