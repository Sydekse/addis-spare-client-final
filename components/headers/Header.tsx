"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, User, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "@/context/use-cart";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const router = useRouter();

  const onNavigate = (page: string) => {
    router.push(page);
  };

  const handleUserAction = (action: string) => {
    if (action === "logout") {
      logout();
      onNavigate?.("/");
    } else {
      onNavigate?.("/" + action);
    }
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => onNavigate?.("menu")}
            >
              <Menu className="h-5 w-5" />
            </Button> */}

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold">A</span> */}
                <Image
                  src="/images/asp-logo.png"
                  alt="Addis Spare Parts"
                  className="rounded-full bg-white"
                  width={50}
                  height={50}
                />
              </div>
              <span className="hidden md:block font-bold text-lg">
                Addis Spare Parts
              </span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                <Link
                  href="/account?tab=messages"
                  className="relative hidden md:flex"
                >
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Link>
              </>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">Home Page</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile Settings</Link>
                  </DropdownMenuItem>

                  {user.role === "supplier" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/supplier-dashboard">
                          Supplier Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin-dashboard">Admin Panel</Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleUserAction("logout")}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
