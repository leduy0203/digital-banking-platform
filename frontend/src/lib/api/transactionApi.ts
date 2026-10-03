import { apiClient } from '../axios';
import { TransactionResponseData } from './transferApi';

export interface TransactionSummaryData {
  id: string;
  transactionCode: string;
  amount: number;
  direction: 'IN' | 'OUT';
  counterpartAccountNumber: string;
  counterpartName: string;
  description?: string;
  transactionType: 'INTERNAL_TRANSFER' | 'EXTERNAL_TRANSFER' | 'BILL_PAYMENT' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TransactionHistoryApiResponse {
  success: boolean;
  message: string;
  data: PageResponse<TransactionSummaryData>;
  timestamp: string;
}

export interface SingleTransactionApiResponse {
  success: boolean;
  message: string;
  data: TransactionResponseData;
  timestamp: string;
}

export interface TransactionHistoryFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  accountNumber?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export const transactionApi = {
  /**
   * GET /api/v1/transactions/my-history
   * Retrieve paginated and filtered personal transaction history
   */
  async getMyHistory(params?: TransactionHistoryFilterParams): Promise<TransactionHistoryApiResponse> {
    const res = await apiClient.get<TransactionHistoryApiResponse>('/transactions/my-history', {
      params,
    });
    return res.data;
  },

  /**
   * GET /api/v1/transactions/{transactionCode}
   * Retrieve full details / receipt of a transaction
   */
  async getTransactionDetail(transactionCode: string): Promise<SingleTransactionApiResponse> {
    const res = await apiClient.get<SingleTransactionApiResponse>(`/transactions/${transactionCode}`);
    return res.data;
  },
};
