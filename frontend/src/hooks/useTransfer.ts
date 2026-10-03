import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  transferApi, 
  InternalTransferInitiatePayload, 
  InternalTransferInitiateApiResponse,
  InternalTransferConfirmPayload, 
  InternalTransferConfirmApiResponse 
} from '@/lib/api';

export function useTransfer() {
  const queryClient = useQueryClient();

  // Step 1: Initiate Transfer Mutation
  const initiateMutation = useMutation<InternalTransferInitiateApiResponse, Error, InternalTransferInitiatePayload>({
    mutationFn: (payload: InternalTransferInitiatePayload) => transferApi.initiateInternalTransfer(payload),
  });

  // Step 2: Confirm Transfer Mutation (Smart PIN)
  const confirmMutation = useMutation<InternalTransferConfirmApiResponse, Error, InternalTransferConfirmPayload>({
    mutationFn: (payload: InternalTransferConfirmPayload) => transferApi.confirmInternalTransfer(payload),
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        queryClient.invalidateQueries({ queryKey: ['my-history'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    },
  });

  return {
    initiateTransfer: initiateMutation.mutateAsync,
    isInitiating: initiateMutation.isPending,
    confirmTransfer: confirmMutation.mutateAsync,
    isConfirming: confirmMutation.isPending,
  };
}
