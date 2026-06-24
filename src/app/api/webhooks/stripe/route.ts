import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import pool from "@/lib/db";
import { orderConfirmationEmail, ownerNotificationEmail, orderRefundedEmail } from "@/lib/emails";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { rows } = await pool.query(
      `UPDATE orders SET status = 'paid', stripe_payment_id = $1 WHERE stripe_session_id = $2 RETURNING *`,
      [session.payment_intent as string, session.id],
    );
    const order = rows[0] ?? null;
    console.log("Webhook session_id:", session.id);
    console.log("Order from DB:", order ? `found — ${order.email}` : "null (session_id not matched)");

    const resend = new Resend(process.env.RESEND_API_KEY!);

    if (order) {
      // Owner notification email
      await resend.emails.send({
        from: process.env.OWNER_EMAIL_FROM!,
        to: process.env.OWNER_EMAIL!,
        subject: `New order ${order.order_number} — $${Number(order.total).toFixed(2)} from ${order.shipping_name}`,
        html: ownerNotificationEmail(order),
      });
      console.log("Owner notification email sent.");

      // Customer confirmation email
      await resend.emails.send({
        from: process.env.OWNER_EMAIL_FROM!,
        to: order.email,
        subject: `Order confirmed — ${order.order_number}`,
        html: orderConfirmationEmail(order),
      });
      console.log("Customer confirmation email sent.");

      // WhatsApp notification
      const waRes = await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECIPIENT,
          type: "template",
          template: {
            name: "order_alert",
            language: { code: "en_US" },
            components: [{
              type: "body",
              parameters: [
                { type: "text", text: order?.order_number ?? "New Order" },
                { type: "text", text: `$${Number(order?.total ?? 0).toFixed(2)}` },
              ],
            }],
          },
        }),
      });
      const waData = await waRes.json();
      if (!waRes.ok) console.error("WhatsApp error:", JSON.stringify(waData));
      else console.log("WhatsApp notification sent.");
    } else {
      // Fallback owner email
      await resend.emails.send({
        from: process.env.OWNER_EMAIL_FROM!,
        to: process.env.OWNER_EMAIL!,
        subject: `New payment — $${((session.amount_total ?? 0) / 100).toFixed(2)} from ${session.customer_email ?? "customer"}`,
        html: `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#f7f4ef;padding:40px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e8e0d4;padding:32px;">
    <h2 style="color:#1a1a1a;font-weight:normal;">New Payment Received</h2>
    <p style="color:#888;font-size:13px;">Customer: ${session.customer_email ?? "unknown"}</p>
    <p style="color:#888;font-size:13px;">Amount: <strong style="color:#1a1a1a;">$${((session.amount_total ?? 0) / 100).toFixed(2)}</strong></p>
    <a href="https://velvebags.com/admin/orders" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 28px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-top:16px;">View in Admin</a>
  </div></body></html>`,
      });

      // WhatsApp fallback
      const waRes = await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECIPIENT,
          type: "template",
          template: {
            name: "order_alert",
            language: { code: "en_US" },
            components: [{
              type: "body",
              parameters: [
                { type: "text", text: "New Order" },
                { type: "text", text: `$${((session.amount_total ?? 0) / 100).toFixed(2)}` },
              ],
            }],
          },
        }),
      });
      const waData = await waRes.json();
      if (!waRes.ok) console.error("WhatsApp fallback error:", JSON.stringify(waData));
      else console.log("WhatsApp fallback notification sent.");
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) return NextResponse.json({ received: true });

    const { rows: refundRows } = await pool.query(
      `SELECT * FROM orders WHERE stripe_payment_id = $1 LIMIT 1`,
      [paymentIntentId],
    );
    const order = refundRows[0] ?? null;

    if (!order) {
      console.log("charge.refunded: no order found for payment_intent", paymentIntentId);
      return NextResponse.json({ received: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.OWNER_EMAIL_FROM!,
      to: order.email,
      subject: `Your refund for order ${order.order_number} has been confirmed`,
      html: orderRefundedEmail(order),
    });
    console.log(`Refund confirmed email sent to ${order.email}`);
  }

  return NextResponse.json({ received: true });
}
