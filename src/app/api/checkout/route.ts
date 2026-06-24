import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  try {
    const { items, shipping, promoCode } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.id);
    const { rows: products } = await pool.query(
      `SELECT id, name, price, stock, images FROM products WHERE id = ANY($1) AND is_published = true`,
      [productIds],
    );

    if (!products.length) {
      return NextResponse.json({ error: "Products not found" }, { status: 400 });
    }

    let discountAmount = 0;
    let discountCodeId: string | null = null;

    if (promoCode) {
      const { rows: codes } = await pool.query(
        `SELECT * FROM discount_codes WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > now()) AND (usage_limit IS NULL OR usage_count < usage_limit) LIMIT 1`,
        [promoCode.toUpperCase()],
      );
      const code = codes[0];
      if (code) {
        const subtotal = items.reduce((acc: number, item: any) => {
          const product = products.find((p: any) => p.id === item.id);
          return acc + (Number(product?.price) ?? 0) * item.quantity;
        }, 0);
        discountCodeId = code.id;
        discountAmount =
          code.type === "percentage"
            ? (subtotal * code.value) / 100
            : Math.min(code.value, subtotal);
      }
    }

    const lineItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.id)!;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: product.images?.[0] ? [product.images[0]] : [],
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    if (discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Discount (${promoCode})` },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      });
    }

    const subtotal = items.reduce((acc: number, item: any) => {
      const p = products.find((pr: any) => pr.id === item.id);
      return acc + (Number(p?.price) ?? 0) * item.quantity;
    }, 0);
    const orderTotal = Math.max(0, subtotal - discountAmount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: shipping.email,
      metadata: {
        shipping_name: shipping.fullName,
        shipping_email: shipping.email,
      },
    });

    // Generate order number
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM orders`);
    const orderNumber = `VLV-${String(Number(countRows[0].count) + 1).padStart(5, "0")}`;

    const { rows: inserted } = await pool.query(
      `INSERT INTO orders (order_number, email, items, subtotal, discount_amount, discount_code_id, total, status, shipping_name, shipping_address, shipping_city, shipping_state, shipping_country, shipping_postcode, shipping_phone, stripe_session_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [
        orderNumber,
        shipping.email,
        JSON.stringify(items.map((item: any) => {
          const p = products.find((pr: any) => pr.id === item.id);
          return {
            product_id: item.id,
            name: item.name,
            price: Number(p?.price ?? item.price),
            quantity: item.quantity,
            colour: item.colour,
            size: item.size,
            image_url: p?.images?.[0] ?? item.image,
          };
        })),
        subtotal,
        discountAmount,
        discountCodeId,
        orderTotal,
        shipping.fullName,
        shipping.address,
        shipping.city,
        shipping.state,
        shipping.country,
        shipping.postcode,
        shipping.phone,
        session.id,
      ],
    );

    console.log("Order saved to DB:", inserted[0]?.id, "session:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
