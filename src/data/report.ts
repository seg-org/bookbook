import { AxiosResponse } from "axios";

import { apiClient } from "./axios";

export const getAllReport = async () => {
  try {
    const res: AxiosResponse = await apiClient.get("/chat/report");
    return res.data;
  } catch (error) {
    console.error("Failed to get all posts", error);
    return Error("Failed to get all posts");
  }
};
