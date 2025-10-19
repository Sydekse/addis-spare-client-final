"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { findUserById } from "@/lib/api/services/user.service";

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

export function useAuth(
  redirectIfUnauthorized: boolean = false,
  role: string = "none"
) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);

      if (redirectIfUnauthorized || role !== "none") {
        router.push("/sign-in");
      }
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Check if token is expired
      if (Date.now() >= decoded.exp * 1000) {
        logout();
        if (redirectIfUnauthorized) {
          router.push("/sign-in");
        }
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("No stored user found");

      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);

      // Role-based check
      if (role !== "none") {
        const userRole = parsedUser.role;
        if (userRole !== role) {
          router.push("/");
          return;
        }
      }

      // Supplier onboarding check
      if (parsedUser.role === "supplier" && parsedUser.isOnboarded !== true) {
        router.push("/supplier/onboard");
        return;
      }

      setIsAuthenticated(true);

      // ✅ After everything is set, revalidate user in background
      if (parsedUser?.id) {
        findUserById(parsedUser.id)
          .then((freshUser) => {
            if (freshUser) {
              setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));

              // Handle changes in role/onboarding dynamically
              if (
                freshUser.role === "supplier" &&
                freshUser.isOnboarded !== true
              ) {
                router.push("/supplier/onboard");
              } else if (role !== "none" && freshUser.role !== role) {
                router.push("/");
              }
            }
          })
          .catch((err) => {
            console.error("Failed to revalidate user:", err);
          });
      }
    } catch (err) {
      console.error("Auth error:", err);
      logout();
      if (redirectIfUnauthorized) {
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  }, [redirectIfUnauthorized, role, router]);

  const login = (token: string, user: User) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, loading, user, login, logout };
}
