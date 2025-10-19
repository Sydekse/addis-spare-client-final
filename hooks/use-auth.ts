"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

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
      } else {
        // Restore user from localStorage
        const storedUser = localStorage.getItem("user");

        let parsedUser: User | null = null;
        if (storedUser) {
          parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } else {
          // If no stored user but token exists, treat as invalid state
          throw new Error("No stored user found");
        }

        if (role !== "none") {
          const userRole = parsedUser.role;
          if (userRole !== role) {
            router.push("/");
          }
        }

        setIsAuthenticated(true);
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
