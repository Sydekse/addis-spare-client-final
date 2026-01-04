export interface NotificationRelatedTo {
  entity: string;
  id: string;
}

export interface Notification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  relatedTo?: NotificationRelatedTo;
  status: NotificationStatus;
  createdAt: Date;
  sentAt?: Date;
}
export enum NotificationStatus {
  PENDING = "PENDING",
  FAILED = "FAILED",
  SENT = "SENT",
}

export enum NotificationChannel {
  SMS = "SMS",
  GMAIL = "GMAIL",
  IN_APP = "IN-APP",
}

export interface NotificationRelatedTo {
  entity: string;
  id: string;
}

export interface CreateNotificationDto {
  userId: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  status: NotificationStatus;
  relatedTo?: NotificationRelatedTo;
}

export interface UpdateNotificationDto {
  userId?: string;
  channel?: NotificationChannel;
  subject?: string;
  message?: string;
  status?: NotificationStatus;
  relatedTo?: NotificationRelatedTo;
  sentAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  relatedTo?: NotificationRelatedTo;
  status: NotificationStatus;
  createdAt: Date;
  sentAt?: Date;
}

export interface PWDSubscribeDto {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushNotificationSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
  updatedAt: Date;
}
