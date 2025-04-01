import { AxiosResponse } from "axios";

import { apiClient } from "./axios";
import { CreateTransactionDto,Transaction  } from "./dto/transaction.dto";

interface TransactionBaseQuery {
  userId?: string;

  startDate?: Date;
  endDate?: Date;
  asBuyer?: boolean;
  asSeller?: boolean;
  isPacking?: boolean;
  isDelivering?: boolean;
  isHold?: boolean;
  isComplete?: boolean;
  isFail?: boolean;
}

interface TransactionQuery extends TransactionBaseQuery {
  skip?: number;
  take?: number;
}

type TransactionCount = TransactionBaseQuery;

type TransactionAmount = TransactionBaseQuery;

interface TransactionUpdate {
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

  evidenceURL?: string;
  detail?: string;
  failType?: string;
}

export const getQueryTransaction = async (query: TransactionQuery) => {
  try {
    const params: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      asBuyer?: boolean;
      asSeller?: boolean;
      isPacking?: boolean;
      isDelivering?: boolean;
      isHold?: boolean;
      isComplete?: boolean;
      isFail?: boolean;
      skip?: number;
      take?: number;
    } = {
      ...(query.userId !== undefined ? { userId: query.userId } : {}),
      ...(query.startDate !== undefined ? { startDate: query.startDate } : {}),
      ...(query.endDate !== undefined ? { endDate: query.endDate } : {}),
      ...(query.asBuyer !== undefined ? { asBuyer: query.asBuyer } : {}),
      ...(query.asSeller !== undefined ? { asSeller: query.asSeller } : {}),
      ...(query.isPacking !== undefined ? { isPacking: query.isPacking } : {}),
      ...(query.isDelivering !== undefined ? { isDelivering: query.isDelivering } : {}),
      ...(query.isHold !== undefined ? { isHold: query.isHold } : {}),
      ...(query.isComplete !== undefined ? { isComplete: query.isComplete } : {}),
      ...(query.isFail !== undefined ? { isFail: query.isFail } : {}),
      ...(query.skip !== undefined ? { skip: query.skip } : {}),
      ...(query.take && query.take >= 0 ? { take: query.take } : {}),
    };

    const res: AxiosResponse<Transaction[]> = await apiClient.get("/transaction", { params });

    return res.data.map((val) => ({
      ...val,
      createdAt: new Date(val.createdAt),
      updatedAt: new Date(val.updatedAt),
      paidOn: new Date(val.paidOn),
    }));
  } catch (error) {
    console.error("Failed to get query transaction", error);
    return Error("Failed to get query transaction");
  }
};

export const getTransaction = async (id: string) => {
  try {
    const res: AxiosResponse<Transaction> = await apiClient.get(`/transaction/${id}`);

    return {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
      paidOn: new Date(res.data.paidOn),
    };
  } catch (error) {
    console.error(`Failed to get transaction with id ${id}`, error);
    return Error(`Failed to get transaction with id ${id}`);
  }
};

export const getTransactionAmount = async (query: TransactionAmount) => {
  try {
    const params: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      asBuyer?: boolean;
      asSeller?: boolean;
      isPacking?: boolean;
      isDelivering?: boolean;
      isHold?: boolean;
      isComplete?: boolean;
      isFail?: boolean;
    } = {
      ...(query.userId !== undefined ? { userId: query.userId } : {}),
      ...(query.startDate !== undefined ? { startDate: query.startDate } : {}),
      ...(query.endDate !== undefined ? { endDate: query.endDate } : {}),
      ...(query.asBuyer !== undefined ? { asBuyer: query.asBuyer } : {}),
      ...(query.asSeller !== undefined ? { asSeller: query.asSeller } : {}),
      ...(query.isPacking !== undefined ? { isPacking: query.isPacking } : {}),
      ...(query.isDelivering !== undefined ? { isDelivering: query.isDelivering } : {}),
      ...(query.isHold !== undefined ? { isHold: query.isHold } : {}),
      ...(query.isComplete !== undefined ? { isComplete: query.isComplete } : {}),
      ...(query.isFail !== undefined ? { isFail: query.isFail } : {}),
    };

    const res: AxiosResponse<number> = await apiClient.get("/transaction/amount", { params });

    return res.data;
  } catch (error) {
    console.error("Failed to get transaction amount", error);
    return Error("Failed to get transaction amount");
  }
};

export const getTransactionCount = async (query: TransactionCount) => {
  try {
    const params: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      asBuyer?: boolean;
      asSeller?: boolean;
      isPacking?: boolean;
      isDelivering?: boolean;
      isHold?: boolean;
      isComplete?: boolean;
      isFail?: boolean;
    } = {
      ...(query.userId !== undefined ? { userId: query.userId } : {}),
      ...(query.startDate !== undefined ? { startDate: query.startDate } : {}),
      ...(query.endDate !== undefined ? { endDate: query.endDate } : {}),
      ...(query.asBuyer !== undefined ? { asBuyer: query.asBuyer } : {}),
      ...(query.asSeller !== undefined ? { asSeller: query.asSeller } : {}),
      ...(query.isPacking !== undefined ? { isPacking: query.isPacking } : {}),
      ...(query.isDelivering !== undefined ? { isDelivering: query.isDelivering } : {}),
      ...(query.isHold !== undefined ? { isHold: query.isHold } : {}),
      ...(query.isComplete !== undefined ? { isComplete: query.isComplete } : {}),
      ...(query.isFail !== undefined ? { isFail: query.isFail } : {}),
    };

    const res: AxiosResponse<number> = await apiClient.get("/transaction/count", { params });

    return res.data;
  } catch (error) {
    console.error("Failed to get transaction count", error);
    return Error("Failed to get transaction count");
  }
};

export const createTransaction = async (dto: CreateTransactionDto) => {
  try {
    const res: AxiosResponse<Transaction> = await apiClient.post(`/transaction`, dto);

    return res.data;
  } catch (error) {
    console.error(`Failed to create transaction with dto ${dto}`, error);
    return Error(`Failed to create transaction with dto ${dto}`);
  }
};

export const updateTransaction = async (query: TransactionUpdate) => {
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
      evidenceURL?: string;
      detail?: string;
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

    await apiClient.patch(`/transaction/${id}`, params);

    return;
  } catch (error) {
    console.error("Failed to get transaction count", error);
    return Error("Failed to get transaction count");
  }
};
