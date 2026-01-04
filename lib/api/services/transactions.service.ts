import { CreateTransactionDto, Transaction } from "@/types/transactions";
import api from "../client";

export async function capturePayment(
  data: CreateTransactionDto
): Promise<Transaction> {
  const response = await api.post("/payments/capture", data);
  return response.data;
}

export async function refundPayment(
  transactionId: string
): Promise<Transaction> {
  const response = await api.post(`/payments/refund/${transactionId}`);
  return response.data;
}

export async function voidPayment(transactionId: string): Promise<Transaction> {
  const response = await api.post(`/payments/void/${transactionId}`);
  return response.data;
}
