export type CardType = 'DEBIT' | 'CREDIT' | 'VIRTUAL';
export type CardNetwork = 'VISA' | 'MASTERCARD' | 'NAPAS' | 'JCB';
export type CardStatus = 'ACTIVE' | 'LOCKED' | 'EXPIRED' | 'BLOCKED';

export interface BankCard {
  id: string;
  cardNumber: string; // e.g. "4123 **** **** 8888"
  cardHolderName: string;
  expiryDate: string; // e.g. "08/28"
  cvv: string;
  cardType: CardType;
  network: CardNetwork;
  status: CardStatus;
  linkedAccountId: string;
  accountNumber: string;
  availableBalance: number;
  creditLimit?: number;
  currentDebt?: number;
  isOnlinePaymentEnabled: boolean;
  isInternationalPaymentEnabled: boolean;
  dailyOnlineLimit: number;
  dailyAtmLimit: number;
  dailyPosLimit: number;
  colorScheme: 'emerald' | 'dark' | 'gold' | 'purple' | 'blue';
  createdAt: string;
}

export interface CardTransaction {
  id: string;
  cardId: string;
  merchantName: string;
  merchantCategory: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  location: string;
}
