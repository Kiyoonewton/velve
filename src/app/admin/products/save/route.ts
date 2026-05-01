import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { id, ...payload } = await request.json();

  const { error } = id
    ? await supabaseAdmin.from("products").update(payload).eq("id", id)
    : await supabaseAdmin.from("products").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  if (payload.slug) revalidatePath(`/products/${payload.slug}`);

  return NextResponse.json({ success: true });
}
