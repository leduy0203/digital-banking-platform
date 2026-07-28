import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsApi } from '@/lib/api';
import { CreateSavingsContractPayload, SavingsContractReceipt } from '@/lib/types';

export function useSavings() {
  const queryClient = useQueryClient();

  const openMutation = useMutation<SavingsContractReceipt, Error, CreateSavingsContractPayload>({
    mutationFn: (payload: CreateSavingsContractPayload) => savingsApi.openSavingsContract(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  return {
    openSavings: openMutation.mutateAsync,
    isOpenSaving: openMutation.isPending,
    error: openMutation.error,
  };
}
