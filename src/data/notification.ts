import { AxiosResponse } from "axios";

import { Notification } from "./dto/notification.dto";
import { apiClient } from "./axios";

export const getNotifications = async (userId: string): Promise<Notification[] | Error> => {
  try {
    const res: AxiosResponse<Notification[]> = await apiClient.get("/notifications", {
      params: { userId },
    });

    return res.data;
  } catch (error) {
    console.error(`Failed to get notifications for user ${userId}`, error);
    return Error(`Failed to get notifications for user ${userId}`);
  }
};

export const createNotification = async (
  userId: string,
  message: string,
  link?: string
): Promise<Notification | Error> => {
  try {
    const res: AxiosResponse<Notification> = await apiClient.post("/notifications", {
      userId,
      message,
      link,
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create notification", error);
    return Error("Failed to create notification");
  }
};

export const markNotificationAsRead = async (id: string): Promise<Notification | Error> => {
  try {
    const res: AxiosResponse<Notification> = await apiClient.patch("/notifications", {
      id,
    });

    return res.data;
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read`, error);
    return new Error(`Failed to mark notification ${id} as read`);
  }
};