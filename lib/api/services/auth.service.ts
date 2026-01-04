import type {
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
} from "@/types/auth";
import { getApi } from "../api";

export async function signIn(data: SignInFormData) {
  const api = getApi();
  const response = await api.post("/auth/signin", data);
  return response.data;
}

export async function forgetPassword(email: string) {
  const api = getApi();
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function signUp(data: SignUpFormData) {
  const api = getApi();
  const response = await api.post("/auth/signup", data);
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordFormData,
  token: string
) {
  const api = getApi();
  const response = await api.post(`/auth/reset-password?token=${token}`, data);
  return response.data;
}
