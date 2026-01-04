export interface CreateMessageDto {
  conversationId: string;
  senderId: string;
  recipientId: string;
  body: string;
  attachments?: string[];
}

export interface UpdateMessageDto {
  body: string;
  attachments?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  body: string;
  attachments: string[];
  sentAt: Date;
  readAt?: Date;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface MessagesByOtherUserDTO {
  user: UserInfo;
  messages: Message[];
}
