import { apiClient } from '../axios';

export interface UploadKycImageResponse {
  success: boolean;
  message: string;
  data: {
    publicId: string;
    url: string;
  };
  timestamp: string;
}

export type KycDocType = 'front_card' | 'back_card' | 'selfie';

export const mediaApi = {
  /**
   * POST /media/kyc/upload
   * Uploads temporary KYC image to Cloudinary storage
   */
  async uploadKycImage(file: File, docType: KycDocType): Promise<UploadKycImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    const res = await apiClient.post<UploadKycImageResponse>('/media/kyc/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
