import { useQuery } from '@tanstack/react-query';
import { accountApi } from '@/lib/api';
import { BankAccount } from '@/lib/types';

export function useAccounts() {
  const query = useQuery<BankAccount[], Error>({
    queryKey: ['accounts'],
    queryFn: () => accountApi.getAccounts(),
  });

  return {
    accounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
