import { FilterType } from "@/app/transaction-history-page/components/FilterBar";
import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Transaction } from "./dto/transaction.dto";

export const getTransaction = async (filter: FilterType, userId: string, skip: number, take: number) => {
  try {
    const params: Partial<FilterType> & { userId?: string, skip?: number, take?: number} = {
      ...Object.fromEntries(
        Object.entries(filter)
          .map(([key, value]) => {
            if (key === "asBuyer" || key === "asSeller") {
              return [key, value ? "true" : "false"]; // Convert boolean to string ("true" or "false")
            }
            return [key, value]; // Keep other values unchanged
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => value !== null) // Exclude null values
      ),
      ...(userId !== "" ? { userId: userId } : {}),
      ...(skip >= 0 ? { skip: skip } : {}),
      ...(take >= 0 ? { take: take } : {})
    };

    const res: AxiosResponse<Transaction[]> = await apiClient.get("/transaction", { params });

    return res.data.map((val) => ({
      ...val,
      createdAt: new Date(val.createdAt),
      updatedAt: new Date(val.updatedAt),
      paidOn: new Date(val.paidOn),
    }));
  } catch (error) {
    console.error("Failed to get all transaction", error);
    return Error("Failed to get all transaction");
  }
};

export const getTransactionCount = async (filter: FilterType, userId: string) => {
  try {
    const params: Partial<FilterType> & { userId?: string } = {
      ...Object.fromEntries(
        Object.entries(filter)
          .map(([key, value]) => {
            if (key === "asBuyer" || key === "asSeller") {
              return [key, value ? "true" : "false"]; // Convert boolean to string ("true" or "false")
            }
            return [key, value]; // Keep other values unchanged
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => value !== null) // Exclude null values
      ),
      ...(userId !== "" ? { userId: userId } : {}),
    };

    const res: AxiosResponse<number> = await apiClient.get("/transaction/count", { params })

    return res.data;
  } catch (error) {
    console.error("Failed to get all transaction", error);
    return Error("Failed to get all transaction");
  }
}
