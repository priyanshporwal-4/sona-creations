export const metadata = {
  title: "Admin | Sona Creations",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-2xl mb-8">Admin</h2>

        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-gold">
            Dashboard
          </a>
          <a href="/admin/products" className="block hover:text-gold">
            Products
          </a>
          <a href="/admin/orders" className="block hover:text-gold">
            Orders
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
