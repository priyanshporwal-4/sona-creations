import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-8 py-28 md:py-32 text-center bg-gradient-to-b from-ivory to-white">
        <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
          Crafted Elegance <br /> for Every Occasion
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Discover premium handcrafted clothing designed with elegance, comfort,
          and timeless style.
        </p>

        <Link href="/shop">
          <button className="bg-gold text-white px-10 py-4 rounded-full text-sm tracking-wider hover:scale-105 transition-transform duration-300 shadow-md">
            SHOP COLLECTION
          </button>
        </Link>
      </section>

      <section className="px-8 py-20">
        <h2 className="text-3xl text-center mb-12">Best Sellers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition"
            >
              <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>

              <h3 className="font-medium mb-1">Elegant Kurta Set</h3>

              <p className="text-sm text-gray-500 mb-2">Women Ethnic</p>

              <p className="font-semibold text-gold">₹2,499</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
