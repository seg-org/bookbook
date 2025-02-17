import axios, { AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

apiClient.interceptors.response.use((response: AxiosResponse) => {
  if (response.data) {
    response.data = transformDates(response.data);
  }
  return response;
});

// Helper function to transform all `createdAt` fields to Date objects
const transformDates = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(transformDates);
  } else if (data !== null && typeof data === "object") {
    const newObj: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key === "createdAt" && typeof value === "string") {
        newObj[key] = new Date(value);
      } else {
        newObj[key] = transformDates(value);
      }
    });
    return newObj;
  }
  return data;
};
