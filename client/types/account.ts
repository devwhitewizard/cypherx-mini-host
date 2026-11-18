export interface AccountInfo {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  verified?: boolean;
  isVerified?: boolean;
  verificationStatus?: string;
  credits?: number;
  balance?: number;
  plan?: string;
  tier?: string;
  maxBots?: number;
  createdAt?: string;
  [key: string]: unknown;
}

