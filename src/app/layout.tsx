import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistDrawer } from "@/components/ui/WishlistDrawer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Eloria | Pure Botanical Skincare",
  description: "Scientifically formulated botanical skincare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <WishlistProvider>
            {children}
            <WishlistDrawer />
            <CartDrawer />
            <Toaster position="top-right" />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
