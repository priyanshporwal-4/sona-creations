import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Sona Creations",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Admin</span>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
