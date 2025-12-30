"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItem = (href, label) => {
    const active = pathname.startsWith(href);

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
          ${
            active
              ? "bg-gold text-black font-semibold"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-72 bg-black text-white flex flex-col px-6 py-6">
      {/* BRAND */}
      <Link href="/admin" className="flex items-center gap-3 mb-10">
        <Image
          src="/logo.png"
          alt="Sona Creations"
          width={40}
          height={40}
          priority
        />
        <div>
          <h1 className="text-lg font-semibold tracking-wide">
            Sona Creations
          </h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </Link>

      {/* NAV */}
      <nav className="space-y-2 text-sm">
        {navItem("/admin", "Dashboard")}
        {navItem("/admin/products", "Products")}
        {navItem("/admin/orders", "Orders")}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-6 text-xs text-gray-500">
        © {new Date().getFullYear()} Sona Creations
      </div>
    </aside>
  );
}
