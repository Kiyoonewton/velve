import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await pool.query(
      `INSERT INTO discount_codes (code, type, value, minimum_order, usage_limit, expires_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [body.code, body.type, body.value, body.minimum_order ?? 0, body.usage_limit ?? null, body.expires_at ?? null, body.is_active ?? true],
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json();
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  try {
    await pool.query(`UPDATE discount_codes SET ${set} WHERE id = $${keys.length + 1}`, [...values, id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await pool.query(`DELETE FROM discount_codes WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
