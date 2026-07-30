export type NotificationCategory = 'BALANCE' | 'SECURITY' | 'PROMOTION' | 'SYSTEM';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  amount?: number;
  transactionType?: 'CREDIT' | 'DEBIT';
  accountNumber?: string;
  referenceId?: string;
  actionUrl?: string;
}
