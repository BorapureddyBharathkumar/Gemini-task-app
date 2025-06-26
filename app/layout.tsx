// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar"; // adjust path if needed
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gemini Task App",
  description: "AI Task Planner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
        <div className="min-h-screen ">
            {children}
          </div>
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
