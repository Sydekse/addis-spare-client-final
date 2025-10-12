import api from "../client";
import type {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  PWDSubscribeDto,
  PushNotificationSubscription,
} from "@/types/notification";

// ➕ Create a notification
export async function createNotification(data: CreateNotificationDto) {
  const response = await api.post<Notification>("/notifications", data);
  return response.data;
}

// 📥 Get all notifications
export async function getNotifications() {
  const response = await api.get<Notification[]>("/notifications");
  return response.data;
}

// 👤 Get in-app notifications for a user
export async function getInAppNotifications(userId: string) {
  const response = await api.get<Notification[]>(`/notifications/${userId}/in-app`);
  return response.data;
}

// 🔍 Get a single notification by ID
export async function getNotificationById(id: string) {
  const response = await api.get<Notification>(`/notifications/${id}`);
  return response.data;
}

// 🔔 Subscribe to push notifications (PWD)
export async function subscribeToPushNotifications(data: PWDSubscribeDto) {
  const response = await api.post<PushNotificationSubscription>(
    "/notifications/pwd-subscribe",
    data
  );
  return response.data;
}

// ✏️ Update a notification
export async function updateNotification(id: string, data: UpdateNotificationDto) {
  const response = await api.put<Notification>(`/notifications/${id}`, data);
  return response.data;
}

// 🗑️ Delete a notification
export async function deleteNotification(id: string) {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
}
