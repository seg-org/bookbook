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

export const deletePostReport = async (id: string) => {
  try {
    const res: AxiosResponse = await apiClient.delete(`/view-report/posts/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete post report", error);
    return Error("Failed to delete post report");
  }
};

export const deleteGeneralReport = async (id: string) => {
  try {
    const res: AxiosResponse = await apiClient.delete(`/view-report/general/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete general report", error);
    return Error("Failed to delete general report");
  }
};
