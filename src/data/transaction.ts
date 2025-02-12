import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Transaction } from "./dto/transaction.dto";
import { FilterType } from "@/app/transactionHistoryPage/components/FilterBar";

export const getTransaction = async ( filter: FilterType, userId: string ) => {
  try {
    const params: Partial<FilterType> & { userId?: string } = {
      ...Object.fromEntries(Object.entries(filter).filter(([_, value]) => value !== null)),
      ...(userId !== '' ? { userId: userId } : {})
    }

    const res: AxiosResponse<Transaction[]> = await apiClient.get("/transaction" , { params });

    return res.data.map((val) => ({
      ...val,
      createOn: new Date(val.createOn),
      updateOn: new Date(val.updateOn),
      paidOn: new Date(val.paidOn)
    }));
  } catch (error) {
    console.error("Failed to get all transaction", error);
    return Error("Failed to get all transaction");
  }
};
