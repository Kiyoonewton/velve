import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: { default: "Admin", template: "%s | Velve Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-check server-side — middleware handles the redirect but this
  // is a safety net in case of direct Server Component access
  if (!user || user.user_metadata?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
