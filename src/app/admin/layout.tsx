import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: { default: "Admin", template: "%s | Velve' Bags Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
