import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficiaryApi } from '@/lib/api';
import { Beneficiary, CreateBeneficiaryPayload } from '@/lib/types';

export function useBeneficiaries() {
  const queryClient = useQueryClient();

  const query = useQuery<Beneficiary[], Error>({
    queryKey: ['beneficiaries'],
    queryFn: () => beneficiaryApi.getBeneficiaries(),
  });

  const addMutation = useMutation<Beneficiary, Error, CreateBeneficiaryPayload>({
    mutationFn: (payload: CreateBeneficiaryPayload) => beneficiaryApi.addBeneficiary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
    },
  });

  return {
    beneficiaries: query.data || [],
    isLoading: query.isLoading,
    addBeneficiary: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}
