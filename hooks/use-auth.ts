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

export function useAuth(redirectIfUnauthorized: boolean = false) {
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

      if (redirectIfUnauthorized) {
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
        setIsAuthenticated(true);

        // Restore user from localStorage
        const storedUser = localStorage.getItem("user");
        console.log(`The user that was stored is : `, storedUser)
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (err) {
      console.error("Invalid toke n:", err);
      logout();
      if (redirectIfUnauthorized) {
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  }, [redirectIfUnauthorized, router]);

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
