const SUPPORT_PHONE = "+1 757-770-0766";
const SUPPORT_EMAIL = "owoseenionikepe@gmail.com";
const SITE_URL = "https://velvebags.com";

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e8e0d4;">
    <div style="background:#1a1a1a;padding:24px 32px;">
      <p style="margin:0;color:#c9a96e;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Velve Bags</p>
    </div>
    ${content}
    <div style="padding:20px 32px;border-top:1px solid #f0ece4;text-align:center;">
      <p style="margin:0 0 4px;color:#bbb;font-size:11px;">Questions? Call or WhatsApp us at <a href="tel:${SUPPORT_PHONE}" style="color:#c9a96e;text-decoration:none;">${SUPPORT_PHONE}</a></p>
      <p style="margin:0;color:#bbb;font-size:11px;">Velve Bags · <a href="${SITE_URL}" style="color:#c9a96e;text-decoration:none;">velvebags.com</a></p>
    </div>
  </div>
</body></html>`;
}

function itemsTable(items: any[]) {
  const rows = items.map((i: any) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#1a1a1a;font-size:13px;">${i.name}${i.colour ? ` <span style="color:#888">(${i.colour})</span>` : ""}${i.size ? ` <span style="color:#888">/ ${i.size}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#888;font-size:13px;text-align:center;">× ${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#1a1a1a;font-size:13px;text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join("");
  return `<table width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

export function orderConfirmationEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Order Confirmed</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Thank you for your order, ${order.shipping_name.split(" ")[0]}! We've received your payment and your order is being prepared.</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Date</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:13px;color:#1a1a1a;padding-top:6px;">${new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items ordered</p>
      ${itemsTable(order.items)}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
        ${order.discount_amount > 0 ? `<tr><td style="padding:8px 0;color:#888;font-size:13px;">Discount</td><td style="padding:8px 0;color:#888;font-size:13px;text-align:right;">-$${Number(order.discount_amount).toFixed(2)}</td></tr>` : ""}
        <tr>
          <td style="padding:12px 0 0;font-size:15px;color:#1a1a1a;font-weight:bold;">Total paid</td>
          <td style="padding:12px 0 0;font-size:15px;color:#1a1a1a;font-weight:bold;text-align:right;">$${Number(order.total).toFixed(2)}</td>
        </tr>
      </table>

      <div style="margin:28px 0;border-top:1px solid #f0ece4;padding-top:24px;">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Delivering to</p>
        <p style="margin:0;color:#1a1a1a;font-size:13px;line-height:1.8;">${order.shipping_name}<br>${order.shipping_address}<br>${order.shipping_city}${order.shipping_state ? `, ${order.shipping_state}` : ""}<br>${order.shipping_country} ${order.shipping_postcode ?? ""}</p>
      </div>

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:8px;">
        <p style="margin:0;color:#1a1a1a;font-size:13px;line-height:1.7;">Allow <strong>3–5 business days</strong> for your handcrafted piece to be completed. We'll email you when your order ships.</p>
      </div>
    </div>`;
  return baseLayout(content);
}

export function orderProcessingEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Your order is being prepared</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Great news, ${order.shipping_name.split(" ")[0]}! We've started working on your order.</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items</p>
      ${itemsTable(order.items)}

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:24px;">
        <p style="margin:0;color:#1a1a1a;font-size:13px;line-height:1.7;">Our artisans are handcrafting your piece. We'll send you another email as soon as it ships.</p>
      </div>
    </div>`;
  return baseLayout(content);
}

export function orderShippedEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Your order is on its way!</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Exciting news, ${order.shipping_name.split(" ")[0]}! Your order has been shipped and is heading your way.</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
            ${order.tracking_number ? `<td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Tracking</td>` : ""}
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
            ${order.tracking_number ? `<td style="font-size:13px;color:#c9a96e;padding-top:6px;font-family:monospace;">${order.tracking_number}</td>` : ""}
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Delivering to</p>
      <p style="margin:0 0 24px;color:#1a1a1a;font-size:13px;line-height:1.8;">${order.shipping_address}<br>${order.shipping_city}${order.shipping_state ? `, ${order.shipping_state}` : ""}<br>${order.shipping_country} ${order.shipping_postcode ?? ""}</p>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items shipped</p>
      ${itemsTable(order.items)}

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:24px;">
        <p style="margin:0;color:#1a1a1a;font-size:13px;line-height:1.7;">If you have any questions about your delivery, call or WhatsApp us at <a href="tel:${SUPPORT_PHONE}" style="color:#c9a96e;text-decoration:none;">${SUPPORT_PHONE}</a></p>
      </div>
    </div>`;
  return baseLayout(content);
}

export function orderDeliveredEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Your order has been delivered!</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Hi ${order.shipping_name.split(" ")[0]}, we hope you love your new piece from Velve Bags. Thank you so much for shopping with us!</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">What you ordered</p>
      ${itemsTable(order.items)}

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:24px;">
        <p style="margin:0 0 8px;color:#1a1a1a;font-size:13px;font-weight:bold;">Enjoying your order?</p>
        <p style="margin:0;color:#888;font-size:13px;line-height:1.7;">We'd love to see how you style it — tag us or share with friends. If anything isn't right, reach us at <a href="tel:${SUPPORT_PHONE}" style="color:#c9a96e;text-decoration:none;">${SUPPORT_PHONE}</a> and we'll make it right.</p>
      </div>

      <div style="text-align:center;margin-top:32px;">
        <p style="margin:0 0 16px;color:#888;font-size:13px;">Ready to add another piece to your collection?</p>
        <a href="${SITE_URL}/shop" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 32px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Shop again</a>
      </div>
    </div>`;
  return baseLayout(content);
}

export function orderCancelledEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Your order has been cancelled</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Hi ${order.shipping_name.split(" ")[0]}, we're sorry to let you know that your order <strong style="color:#1a1a1a;">${order.order_number}</strong> has been cancelled. A refund of <strong style="color:#1a1a1a;">$${Number(order.total).toFixed(2)}</strong> is being processed and you will receive another email once Stripe confirms it.</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Refund amount</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">$${Number(order.total).toFixed(2)}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items cancelled</p>
      ${itemsTable(order.items)}

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:24px;">
        <p style="margin:0 0 6px;color:#1a1a1a;font-size:13px;font-weight:bold;">What happens next?</p>
        <p style="margin:0;color:#888;font-size:13px;line-height:1.7;">We have submitted your refund to Stripe. Once Stripe confirms it you will receive a second email. If you have any questions in the meantime, call or WhatsApp us at <a href="tel:${SUPPORT_PHONE}" style="color:#c9a96e;text-decoration:none;">${SUPPORT_PHONE}</a>.</p>
      </div>

      <div style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/shop" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 32px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Browse the store</a>
      </div>
    </div>`;
  return baseLayout(content);
}

export function orderRefundedEmail(order: any) {
  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">Your refund has been confirmed</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Hi ${order.shipping_name.split(" ")[0]}, Stripe has confirmed your refund. It will appear on your original payment method within <strong style="color:#1a1a1a;">5–10 business days</strong> depending on your bank or card provider.</p>

      <div style="background:#f7f4ef;border:1px solid #e8e0d4;padding:16px 20px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Order number</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Refund amount</td>
            <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Reference</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">${order.order_number}</td>
            <td style="font-size:15px;color:#1a1a1a;font-weight:bold;padding-top:6px;">$${Number(order.total).toFixed(2)}</td>
            <td style="font-size:11px;color:#888;padding-top:6px;font-family:monospace;">${order.id.split("-")[0].toUpperCase()}-${order.id.split("-")[1].toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items refunded</p>
      ${itemsTable(order.items)}

      <div style="background:#f7f4ef;border-left:3px solid #c9a96e;padding:14px 18px;margin-top:24px;">
        <p style="margin:0 0 6px;color:#1a1a1a;font-size:13px;font-weight:bold;">Any questions?</p>
        <p style="margin:0;color:#888;font-size:13px;line-height:1.7;">If you haven't received your refund after 10 business days or have any concerns, please reach out at <a href="tel:${SUPPORT_PHONE}" style="color:#c9a96e;text-decoration:none;">${SUPPORT_PHONE}</a>.</p>
      </div>

      <div style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/shop" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 32px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Shop again</a>
      </div>
    </div>`;
  return baseLayout(content);
}

export function ownerNotificationEmail(order: any) {
  const itemsRows = (order.items as any[]).map((i: any) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#1a1a1a;">${i.name}${i.colour ? ` <span style="color:#888">(${i.colour})</span>` : ""}${i.size ? ` <span style="color:#888">/ ${i.size}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#888;text-align:center;">× ${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece4;color:#1a1a1a;text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join("");

  const content = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:normal;">New Order Received</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">A new order has been placed and payment confirmed.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;padding-bottom:12px;">Customer</td></tr>
        <tr><td style="color:#1a1a1a;font-size:14px;">${order.shipping_name}</td></tr>
        <tr><td style="color:#888;font-size:13px;">${order.email}</td></tr>
        ${order.shipping_phone ? `<tr><td style="color:#888;font-size:13px;">${order.shipping_phone}</td></tr>` : ""}
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;padding-bottom:12px;">Ship to</td></tr>
        <tr><td style="color:#1a1a1a;font-size:13px;line-height:1.7;">${order.shipping_address}<br>${order.shipping_city}${order.shipping_state ? `, ${order.shipping_state}` : ""}<br>${order.shipping_country} ${order.shipping_postcode ?? ""}</td></tr>
      </table>

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 12px;">Items</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${itemsRows}
        ${order.discount_amount > 0 ? `<tr><td style="padding:10px 0;color:#888;font-size:13px;">Discount</td><td></td><td style="padding:10px 0;color:#888;text-align:right;">-$${Number(order.discount_amount).toFixed(2)}</td></tr>` : ""}
        <tr>
          <td style="padding:16px 0 0;font-size:15px;color:#1a1a1a;font-weight:bold;">Total</td>
          <td></td>
          <td style="padding:16px 0 0;font-size:15px;color:#1a1a1a;font-weight:bold;text-align:right;">$${Number(order.total).toFixed(2)}</td>
        </tr>
      </table>

      <a href="https://velvebags.com/admin/orders" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 28px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">View in Admin</a>
    </div>`;
  return content.replace('<div style="padding:16px 32px;border-top:1px solid #f0ece4;text-align:center;">', '');
}
