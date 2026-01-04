export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "customer" | "supplier" | "admin" | "support";
  contact: {
    address: string;
    city: string;
    country: string;
  };
  status: "active" | "pending" | "suspended";
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignInResponse {
  refreshToken: string;
  accessToken: string;
  user: User;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  contact: {
    address: string;
    city: string;
    country: string;
  };
}

export interface ResetPasswordFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
