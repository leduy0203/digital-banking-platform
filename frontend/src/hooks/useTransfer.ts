import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferApi } from '@/lib/api';
import { TransferRequest, OtpVerificationPayload, TransferReceipt } from '@/lib/types';

export function useTransfer() {
  const queryClient = useQueryClient();

  const transferMutation = useMutation<TransferReceipt, Error, TransferRequest>({
    mutationFn: (payload: TransferRequest) => transferApi.executeTransfer(payload),
    onSuccess: (receipt) => {
      if (receipt.status === 'COMPLETED') {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    },
  });

  const otpMutation = useMutation<TransferReceipt, Error, OtpVerificationPayload>({
    mutationFn: (payload: OtpVerificationPayload) => transferApi.verifyOtp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    executeTransfer: transferMutation.mutateAsync,
    isTransferring: transferMutation.isPending,
    verifyOtp: otpMutation.mutateAsync,
    isVerifyingOtp: otpMutation.isPending,
  };
}
