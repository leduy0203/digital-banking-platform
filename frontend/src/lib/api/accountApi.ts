import { apiClient } from '../axios';

export interface AccountResponseData {
  id: string;
  accountNumber: string;
  balance: number;
  frozenBalance: number;
  availableBalance: number;
  currency: string;
  accountType: 'CHECKING' | 'SAVINGS';
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
  isDefault?: boolean;
  openedAt: string;
  closedAt?: string | null;
}

export interface SingleAccountResponse {
  success: boolean;
  message: string;
  data: AccountResponseData;
  timestamp: string;
}

export interface AccountLookupResponseData {
  accountNumber: string;
  accountName: string;
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
  bankName: string;
}

export interface AccountLookupResponse {
  success: boolean;
  message: string;
  data: AccountLookupResponseData;
  timestamp: string;
}

export interface AccountsListResponse {
  success: boolean;
  message: string;
  data: AccountResponseData[];
  timestamp: string;
}

export const accountApi = {
  /**
   * GET /api/v1/accounts/my-accounts
   * Fetches all accounts belonging to current logged-in customer
   */
  async getMyAccounts(): Promise<AccountsListResponse> {
    const res = await apiClient.get<AccountsListResponse>('/accounts/my-accounts');
    return res.data;
  },

  /**
   * GET /api/v1/accounts/{accountNumber}/balance
   * Fetches real-time detailed balance for a specific account
   */
  async getAccountBalance(accountNumber: string): Promise<SingleAccountResponse> {
    const res = await apiClient.get<SingleAccountResponse>(`/accounts/${accountNumber}/balance`);
    return res.data;
  },

  /**
   * GET /api/v1/accounts/lookup?accountNumber=...
   * Looks up recipient's full name and status
   */
  async lookupAccount(accountNumber: string): Promise<AccountLookupResponse> {
    const res = await apiClient.get<AccountLookupResponse>('/accounts/lookup', {
      params: { accountNumber },
    });
    return res.data;
  },
};

