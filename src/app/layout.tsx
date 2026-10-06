import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-ivory text-charcoal selection:bg-peach/30`}>
        <CartProvider>
          <WishlistProvider>
            {children}
            <WishlistDrawer />
            <CartDrawer />
            <Toaster 
              position="top-right" 
              toastOptions={{ 
                duration: 4000,
                style: {
                  background: '#3A322C',
                  color: '#FBF3EC',
                  fontSize: '12px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }
              }} 
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
