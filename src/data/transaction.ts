import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Transaction } from "./dto/transaction.dto";
import { FilterType } from "@/app/transaction-history-page/components/FilterBar";

export const getTransaction = async ( filter: FilterType, userId: string ) => {
  try {
    const params: Partial<FilterType> & { userId?: string } = {
      ...Object.fromEntries(
        Object.entries(filter).map(([key, value]) => {
          if (key === "asBuyer" || key === "asSeller") {
            return [key, value ? "true" : "false"]; // Convert boolean to string ("true" or "false")
          }
          return [key, value]; // Keep other values unchanged
        }).filter(([_, value]) => value !== null) // Exclude null values
      ),
      ...(userId !== '' ? { userId: userId } : {})
    }

    const res: AxiosResponse<Transaction[]> = await apiClient.get("/transaction" , { params });

    return res.data.map((val) => ({
      ...val,
      createdAt: new Date(val.createdAt),
      updatedAt: new Date(val.updatedAt),
      paidOn: new Date(val.paidOn)
    }));
  } catch (error) {
    console.error("Failed to get all transaction", error);
    return Error("Failed to get all transaction");
  }
};
