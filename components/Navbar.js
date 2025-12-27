import Link from "next/link";


export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-ivory/80 backdrop-blur">
      {/* Logo */}
      <h1 className="text-2xl font-heading tracking-widest">
        Sona Creations
      </h1>

      {/* Menu */}
      <ul className="hidden md:flex gap-8 text-sm font-medium">
        <li>
          <Link href="/shop" className="hover:text-gold">
            Shop
          </Link>
        </li>

        <li className="hover:text-gold cursor-pointer">New Arrivals</li>
        <li className="hover:text-gold cursor-pointer">About</li>
        <li className="hover:text-gold cursor-pointer">Contact</li>
      </ul>

      {/* Icons */}
      <div className="flex gap-4 text-lg">
        <Link href="/cart">🛒</Link> 👤
      </div>
    </nav>
  );
}
