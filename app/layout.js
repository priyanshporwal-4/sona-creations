import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "../context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} bg-ivory text-charcoal`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
