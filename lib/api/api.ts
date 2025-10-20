// lib/api.ts
import axios, { AxiosInstance } from "axios";

let api: AxiosInstance | null = null;

export const getApi = (): AxiosInstance => {
  if (!api) {
    api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // --- Request interceptor ---
    api.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // --- Response interceptor ---
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          typeof window !== "undefined" &&
          error.response?.status === 401 &&
          !originalRequest._retry &&
          localStorage.getItem("refreshToken")
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const { data } = await axios.post(
              `${
                process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000"
              }/api/auth/refresh`,
              { refreshToken }
            );

            // Save new tokens
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Retry the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api!(originalRequest);
          } catch (refreshError) {
            // Clear tokens and redirect to sign-in
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/sign-in";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return api;
};
