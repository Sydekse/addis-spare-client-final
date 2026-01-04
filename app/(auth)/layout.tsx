import type React from "react";
import type { Metadata } from "next";
import {
  Shield,
  ShoppingCart,
  Search,
  CreditCard,
  Star,
  BarChart3,
} from "lucide-react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Authentication - Addis Spare Part",
  description: "Sign up or login to your Addis Spare Part account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col gap-4">
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-screen-xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                      Addis Spare Part Platform
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your trusted marketplace for automotive spare parts in
                      Ethiopia
                    </p>
                    <div className="space-y-6 mt-6">
                      <div className="border-l-4 border-[#670D2F] pl-4 py-1">
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 text-[#670D2F] mr-2" />
                          <h3 className="font-semibold">
                            Centralized Marketplace
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          A single, user-friendly digital platform connecting
                          buyers with verified suppliers.
                        </p>
                      </div>

                      <div className="border-l-4 border-[#670D2F] pl-4 py-1">
                        <div className="flex items-center">
                          <Search className="h-4 w-4 text-[#670D2F] mr-2" />
                          <h3 className="font-semibold">Smart Part Matching</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Advanced filtering tools that match vehicle make,
                          model, and year with compatible parts.
                        </p>
                      </div>

                      <div className="border-l-4 border-[#670D2F] pl-4 py-1">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-[#670D2F] mr-2" />
                          <h3 className="font-semibold">Seamless Checkout</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Secure payment process supporting both ETB and USD
                          with real-time order tracking.
                        </p>
                      </div>

                      <div className="border-l-4 border-[#670D2F] pl-4 py-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#670D2F] mr-2" />
                          <h3 className="font-semibold">
                            Transparency & Trust
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Product ratings, seller reviews, and clear pricing to
                          build confidence in every purchase.
                        </p>
                      </div>

                      <div className="border-l-4 border-[#670D2F] pl-4 py-1">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-[#670D2F] mr-2" />
                          <h3 className="font-semibold">
                            Inventory Management
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Real-time stock management tools with automatic
                          low-stock alerts for suppliers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-[#670D2F]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Join Our Community</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Create an account today to access Ethiopia&#39;s
                          premier automotive spare parts marketplace. Whether
                          you&#39;re a buyer seeking quality parts or a supplier
                          looking to expand your reach, Addis Spare Part is your
                          trusted platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  md:w-1/2 md:pl-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <Suspense>{children}</Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
