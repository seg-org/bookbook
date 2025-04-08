export type Notification = {
  id: string;
  userId: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
};