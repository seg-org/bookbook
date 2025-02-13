import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { GetObjectUrlResponse, PutObjectResponse } from "./dto/object.dto";

export const putObject = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "book_images");

    const res: AxiosResponse<PutObjectResponse> = await apiClient.put("/objects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to put object", error);
    return Error("Failed to put object");
  }
};

export const getObjectUrl = async (key: string, folder: string) => {
  try {
    const res: AxiosResponse<GetObjectUrlResponse> = await apiClient.get(`/objects/${key}?folder=${folder}`);

    return res.data;
  } catch (error) {
    console.error("Failed to get object", error);
    return Error("Failed to get object");
  }
};
