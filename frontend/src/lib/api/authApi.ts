import { apiClient } from '../axios';

export interface RegisterPayload {
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    phoneNumber: string;
  };
  timestamp: string;
}

export interface SendOtpPayload {
  email: string;
  purpose: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  purpose: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: boolean;
  timestamp: string;
}

export const authApi = {
  /**
   * POST /auth/register
   * Registers a new user account
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return res.data;
  },

  /**
   * POST /auth/send-otp
   * Sends or resends an OTP code to email
   */
  async sendOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const res = await apiClient.post<SendOtpResponse>('/auth/send-otp', payload);
    return res.data;
  },

  /**
   * POST /auth/verify-otp
   * Verifies the OTP code for email verification
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const res = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', payload);
    return res.data;
  },
};
