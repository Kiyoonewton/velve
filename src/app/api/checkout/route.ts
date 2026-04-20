import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { items, shipping, promoCode } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const supabase = await createClient();

    // Validate products and prices server-side — never trust client prices
    const productIds = items.map((i: any) => i.id);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, stock, images")
      .in("id", productIds)
      .eq("is_published", true);

    if (!products?.length) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 400 },
      );
    }

    // Validate promo code
    let discountAmount = 0;
    let discountCodeId: string | null = null;

    if (promoCode) {
      const { data: code } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (code) {
        const subtotal = items.reduce((acc: number, item: any) => {
          const product = products.find((p) => p.id === item.id);
          return acc + (product?.price ?? 0) * item.quantity;
        }, 0);

        discountCodeId = code.id;
        discountAmount =
          code.type === "percentage"
            ? (subtotal * code.value) / 100
            : Math.min(code.value, subtotal);
      }
    }

    // Build Stripe line items using server-validated prices
    const lineItems = items.map(
      (item: any) => {
        const product = products.find((p) => p.id === item.id)!;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: product.images?.[0] ? [product.images[0]] : [],
            },
            unit_amount: Math.round(product.price * 100), // cents
          },
          quantity: item.quantity,
        };
      },
    );

    // Add discount as a negative line item
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
      const p = products.find((pr) => pr.id === item.id);
      return acc + (p?.price ?? 0) * item.quantity;
    }, 0);
    const orderTotal = Math.max(0, subtotal - discountAmount);

    // Create Stripe Checkout Session
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

    // Create pending order in Supabase
    await supabase.from("orders").insert({
      email: shipping.email,
      items: items.map((item: any) => {
        const p = products.find((pr) => pr.id === item.id);
        return {
          product_id: item.id,
          name: item.name,
          price: p?.price ?? item.price,
          quantity: item.quantity,
          colour: item.colour,
          size: item.size,
          image_url: p?.images?.[0] ?? item.image,
        };
      }),
      subtotal: subtotal,
      discount_amount: discountAmount,
      discount_code_id: discountCodeId,
      total: orderTotal,
      status: "pending",
      shipping_name: shipping.fullName,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_country: shipping.country,
      shipping_postcode: shipping.postcode,
      shipping_phone: shipping.phone,
      stripe_session_id: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
