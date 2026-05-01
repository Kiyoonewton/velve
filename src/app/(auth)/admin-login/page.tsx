import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login" };

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const from = formData.get("from") as string;

  if (password === process.env.ADMIN_SECRET) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect(from || "/admin");
  } else {
    redirect(`/admin-login?error=1${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-(--bg) px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-[var(--fg)] mb-1">Admin</h1>
          <p className="text-sm text-[var(--muted)]">Enter your password to continue</p>
        </div>

        <form action={login} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <input type="hidden" name="from" value={from ?? ""} />

          <label className="block text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="
              w-full h-10 px-3 text-sm mb-4
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--fg)] placeholder:text-[var(--muted)]
              focus:outline-none focus:border-[var(--gold)]
              transition-colors duration-200
            "
            placeholder="••••••••"
          />

          {error && (
            <p className="text-[12px] text-red-500 mb-4">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            className="
              w-full py-2.5 text-[12px] tracking-[0.08em] uppercase font-medium
              bg-[var(--fg)] text-[var(--bg)]
              hover:opacity-85 transition-opacity duration-200
            "
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
