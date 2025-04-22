import { apiClient } from "./axios";

interface ValidateRefund {
  id: string;
  status?: string;

  paymentMethod?: string;
  hashId?: string;
  amount?: number;

  shipmentMethod?: string;
  address?: string;
  trackingURL?: boolean;
  trackingNumber?: string;
  isDelivered?: boolean;

  evidenceURL?: string[];
  detail?: string[];
  failType?: string;
}

export const validateRefund = async (query: ValidateRefund) => {
  try {
    const id = query.id;

    const params: {
      status?: string;
      paymentMethod?: string;
      hashId?: string;
      amount?: number;
      shipmentMethod?: string;
      address?: string;
      trackingURL?: boolean;
      trackingNumber?: string;
      isDelivered?: boolean;
      evidenceURL?: string[];
      detail?: string[];
      failType?: string;
    } = {
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.paymentMethod !== undefined ? { paymentMethod: query.paymentMethod } : {}),
      ...(query.hashId !== undefined ? { hashId: query.hashId } : {}),
      ...(query.amount !== undefined ? { amount: query.amount } : {}),
      ...(query.shipmentMethod !== undefined ? { shipmentMethod: query.shipmentMethod } : {}),
      ...(query.address !== undefined ? { address: query.address } : {}),
      ...(query.trackingURL !== undefined ? { trackingURL: query.trackingURL } : {}),
      ...(query.trackingNumber !== undefined ? { trackingNumber: query.trackingNumber } : {}),
      ...(query.isDelivered !== undefined ? { isDelivered: query.isDelivered } : {}),
      ...(query.evidenceURL !== undefined ? { evidenceURL: query.evidenceURL } : {}),
      ...(query.detail !== undefined ? { detail: query.detail } : {}),
      ...(query.failType !== undefined ? { failType: query.failType } : {}),
    };

    return await apiClient.patch(`/admin/validate-refund/${id}`, params);
  } catch (error) {
    console.error("Failed to update transaction", error);
    return Error("Failed to update transaction");
  }
};
