import { AxiosResponse } from "axios";
import JSZip from "jszip";

import { apiClient } from "./axios";
import { GetObjectUrlResponse, PutObjectResponse } from "./dto/object.dto";

export const putObject = async (file: File, folder: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res: AxiosResponse<PutObjectResponse> = await apiClient.put("/objects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to put object", error);
    return Error("Failed to put object");
  }
};

export const putObjectsAsZip = async (files: File[], folder: string) => {
  try {
    const zip = new JSZip();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      zip.file(file.name, arrayBuffer);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zippedFile = new File([zipBlob], "zippedFile", { type: "application/zip" });

    const formData = new FormData();
    formData.append("file", zippedFile);
    formData.append("folder", folder);

    const res: AxiosResponse<PutObjectResponse> = await apiClient.put("/objects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error uploading zipped files:", error);
    throw new Error("Failed to upload zipped files");
  }
};

export const getObjectUrl = async (key: string, folder: string) => {
  try {
    const res: AxiosResponse<GetObjectUrlResponse> = await apiClient.get(`/objects/${key}?folder=${folder}`);
    return res.data;
  } catch (error) {
    console.error("Failed to get object URL", error);
    return Error("Failed to get object URL");
  }
};
