import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { User } from "./dto/user.dto";

export const getUser = async (id: string) => {
  try {
    const res: AxiosResponse<User> = await apiClient.get(`/users/${id}`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get user with id ${id}`, error);
    return Error(`Failed to get user with id ${id}`);
  }
};
