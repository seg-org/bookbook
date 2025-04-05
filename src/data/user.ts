import { AxiosResponse } from "axios";

import { apiClient } from "./axios";
import { User } from "./dto/user.dto";

export const getUserProfile = async (id: string) => {
  try {
    const res: AxiosResponse<User> = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/seller/${id}`,
    );

    return res.data;
  } catch (error) {
    console.error(`Failed to get profile with user id ${id}`, error);
    return Error(`Failed to get profile with user id ${id}`);
  }
};
