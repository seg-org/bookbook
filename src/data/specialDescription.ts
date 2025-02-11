import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { SpecialDescription } from "./dto/specialDescription.dto";

export const getSpecialDescriptionsFromPost = async (postId: string) => {
  try {
    const res: AxiosResponse<SpecialDescription[]> = await apiClient.get(`/specialDescriptions?postId=${postId}`);

    return res.data;
  } catch (error) {
    console.error("Failed to get special descriptions", error);
    return Error("Failed to get special descriptions");
  }
};