import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import pool from "@/lib/db";
import { orderProcessingEmail, orderShippedEmail, orderDeliveredEmail, orderCancelledEmail, orderRefundedEmail } from "@/lib/emails";

export async function POST(req: NextRequest) {
  const { orderId, status, trackingNumber } = await req.json();

  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
  }

  // When cancelling, issue a Stripe refund first then mark as refunded
  if (status === "cancelled") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { rows: existing } = await pool.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
    const ex = existing[0];

    if (ex?.stripe_payment_id) {
      try {
        await stripe.refunds.create({ payment_intent: ex.stripe_payment_id });
        console.log(`Stripe refund issued for ${ex.stripe_payment_id}`);
      } catch (err: any) {
        console.error("Stripe refund failed:", err.message);
      }
    }

    const { rows } = await pool.query(
      `UPDATE orders SET status = 'refunded' WHERE id = $1 RETURNING *`,
      [orderId],
    );
    const order = rows[0];
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

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

  // Build update query
  const fields: string[] = ["status = $1"];
  const values: any[] = [status];

  if (trackingNumber !== undefined) {
    fields.push(`tracking_number = $${values.length + 1}`);
    values.push(trackingNumber || null);
  }

  values.push(orderId);
  const { rows } = await pool.query(
    `UPDATE orders SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );
  const order = rows[0];
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const resend = new Resend(process.env.RESEND_API_KEY!);

  if (status === "processing") {
    await resend.emails.send({ from: process.env.OWNER_EMAIL_FROM!, to: order.email, subject: `Your order ${order.order_number} is being prepared`, html: orderProcessingEmail(order) });
    console.log(`Processing email sent to ${order.email}`);
  }
  if (status === "shipped") {
    await resend.emails.send({ from: process.env.OWNER_EMAIL_FROM!, to: order.email, subject: `Your order ${order.order_number} has shipped!`, html: orderShippedEmail(order) });
    console.log(`Shipped email sent to ${order.email}`);
  }
  if (status === "delivered") {
    await resend.emails.send({ from: process.env.OWNER_EMAIL_FROM!, to: order.email, subject: `Thank you for your order, ${order.shipping_name.split(" ")[0]}!`, html: orderDeliveredEmail(order) });
    console.log(`Delivered email sent to ${order.email}`);
  }
  if (status === "refunded") {
    await resend.emails.send({ from: process.env.OWNER_EMAIL_FROM!, to: order.email, subject: `Your refund for order ${order.order_number} is being processed`, html: orderRefundedEmail(order) });
    console.log(`Refunded email sent to ${order.email}`);
  }

  return NextResponse.json({ ok: true, order });
}
