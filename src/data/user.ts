import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { User } from "./dto/user.dto";

export const getUserProfile = async (id: string) => {
  try {
    const res: AxiosResponse<User> = await apiClient.get(`/profile/seller/user_1`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get profile with user id ${id}`, error);
    return Error(`Failed to get profile with user id ${id}`);
  }
};
