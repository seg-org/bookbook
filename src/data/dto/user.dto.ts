export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  address: string;
  isAdmin: boolean;
  isSeller: boolean;
  isVerified: boolean;
  emailVerified: string;
  phoneVerified: string;
  pdpaConsent: boolean;
  createdAt: string;
  updatedAt: string;
  sellerProfile?: {
    id: string;
    idCardNumber: string;
    idCardImageKey: string;
    idCardImageUrl: string;
    bankAccount: string;
    bankName: string;
    isApproved: boolean;
    approvedAt: string;
    userId: string;
  };
};
