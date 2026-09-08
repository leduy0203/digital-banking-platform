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

export interface UserSummary {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string | null;
  isProfileCompleted: boolean;
  roles: string[];
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: AuthResponseData | boolean;
  timestamp: string;
}

export interface LoginPayload {
  username: string; // Email or Phone
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
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
   * Verifies the OTP code for email verification and gets auth tokens
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const res = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', payload);
    return res.data;
  },

  /**
   * POST /auth/login
   * Authenticates user and returns JWT access and refresh tokens
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', payload);
    return res.data;
  },

  /**
   * POST /auth/logout
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },
};

