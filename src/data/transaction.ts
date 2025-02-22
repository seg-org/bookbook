import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Transaction } from "./dto/transaction.dto";

interface TransactionQuery {
  userId?: string;

  startDate?: Date;
  endDate?: Date;
  asBuyer?: boolean;
  asSeller?: boolean;

  skip?: number;
  take?: number;
}

interface TransactionCount {
  userId?: string;

  startDate?: Date;
  endDate?: Date;
  asBuyer?: boolean;
  asSeller?: boolean;
}

export const getQueryTransaction = async (query: TransactionQuery) => {
  try {
    const params: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      asBuyer?: boolean;
      asSeller?: boolean;
      skip?: number;
      take?: number;
    } = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.startDate ? { startDate: query.startDate } : {}),
      ...(query.endDate ? { endDate: query.endDate } : {}),
      ...(query.asBuyer ? { asBuyer: query.asBuyer } : {}),
      ...(query.asSeller ? { asSeller: query.asSeller } : {}),
      ...(query.skip ? { skip: query.skip } : {}),
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

export const getTransactionCount = async (query: TransactionCount) => {
  try {
    const params: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      asBuyer?: boolean;
      asSeller?: boolean;
    } = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.startDate ? { startDate: query.startDate } : {}),
      ...(query.endDate ? { endDate: query.endDate } : {}),
      ...(query.asBuyer ? { asBuyer: query.asBuyer } : {}),
      ...(query.asSeller ? { asSeller: query.asSeller } : {}),
    };
    const res: AxiosResponse<number> = await apiClient.get("/transaction/count", { params });

    return res.data;
  } catch (error) {
    console.error("Failed to get transaction count", error);
    return Error("Failed to get transaction count");
  }
};
