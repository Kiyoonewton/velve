import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const { id, ...payload } = await request.json();

  try {
    if (id) {
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
      await pool.query(
        `UPDATE products SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id],
      );
    } else {
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const cols = keys.join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      await pool.query(`INSERT INTO products (${cols}) VALUES (${placeholders})`, values);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  if (payload.slug) revalidatePath(`/products/${payload.slug}`);

  return NextResponse.json({ success: true });
}
