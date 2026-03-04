import { AuthProvider } from "@/lib/AuthProvider";
import { ProductProvider } from "@/lib/ProductContext";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}