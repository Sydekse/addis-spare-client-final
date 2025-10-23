import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "../styles/globals.css";
import { Header } from "@/components/headers/Header";
import { Providers } from "@/context/providers";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"], variable: "--font-outfit" });


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Addis Spare Part",
  description: "Ethiopia's Premier Spare Parts Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${geistSans.variable} ${outfit.variable}  antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-grow">
          <Providers>
            <Toaster></Toaster>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
