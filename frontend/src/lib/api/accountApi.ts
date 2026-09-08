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
  openedAt: string;
  closedAt?: string | null;
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
};
