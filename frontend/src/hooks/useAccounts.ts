import { useQuery } from '@tanstack/react-query';
import { accountApi } from '@/lib/api';
import { BankAccount } from '@/lib/types';

export function useAccounts() {
  const query = useQuery<BankAccount[], Error>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await accountApi.getMyAccounts();
      if (res?.success && res.data) {
        return res.data.map(a => ({
          id: a.id,
          accountNumber: a.accountNumber,
          accountName: a.accountType === 'CHECKING' ? 'Tài khoản thanh toán mặc định' : 'Tài khoản tiết kiệm',
          accountType: a.accountType,
          balance: a.balance,
          availableBalance: a.availableBalance ?? a.balance ?? 0,
          currency: a.currency,
          isDefault: a.accountType === 'CHECKING',
          status: a.status === 'BLOCKED' ? 'FROZEN' : 'ACTIVE',
          createdAt: a.openedAt,
        }));
      }
      return [];
    },
  });

  return {
    accounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
