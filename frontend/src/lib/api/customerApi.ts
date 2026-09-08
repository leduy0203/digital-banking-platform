import { apiClient } from '../axios';

export interface CustomerOnboardingPayload {
  fullName: string;
  nationalId: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: string;
  frontIdCardUrl: string;
  backIdCardUrl: string;
  selfiePhotoUrl: string;
}

export interface CustomerProfile {
  id: string;
  customerCode: string;
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  avatarUrl: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_SUBMITTED';
  defaultAccountNumber?: string;
  defaultBalance?: number;
  createdAt: string;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: CustomerProfile;
  timestamp: string;
}

export interface UpdateProfilePayload {
  address?: string;
  avatarUrl?: string;
}

export const customerApi = {
  /**
   * POST /customers/onboarding
   * Completes customer profile & eKYC verification and creates default checking account
   */
  async completeOnboarding(payload: CustomerOnboardingPayload): Promise<CustomerResponse> {
    const res = await apiClient.post<CustomerResponse>('/customers/onboarding', payload);
    return res.data;
  },

  /**
   * GET /customers/me
   * Fetches current customer's profile and KYC status
   */
  async getMyProfile(): Promise<CustomerResponse> {
    const res = await apiClient.get<CustomerResponse>('/customers/me');
    return res.data;
  },

  /**
   * PUT /customers/me
   * Updates customer profile details
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<CustomerResponse> {
    const res = await apiClient.put<CustomerResponse>('/customers/me', payload);
    return res.data;
  },
};
