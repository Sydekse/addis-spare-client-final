export enum TransactionType {
  CAPTURE = 'capture',
  REFUND = 'refund',
  VOID = 'void',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  gatewayResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDto {
  orderId: string;
  type: TransactionType;
}

export interface RefundTransactionDto {
  originalTransactionId: string;
}

export interface VoidPaymentDto {
  originalTransactionId: string;
}
