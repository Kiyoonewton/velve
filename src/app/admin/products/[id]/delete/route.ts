import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");

  return NextResponse.json({ success: true });
}
