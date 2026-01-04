import {
  MessagesByOtherUserDTO,
  CreateMessageDto,
  Message,
  UpdateMessageDto,
} from "@/types/messages";
import api from "../client";

// ➕ Create a new message
export async function createMessage(data: CreateMessageDto) {
  const response = await api.post<Message>("/messages", data);
  return response.data;
}

// 🧵 Get messages for a thread (conversation)
export async function getMessagesByThread(conversationId: string) {
  const response = await api.get<Message[]>(
    `/messages/thread/${conversationId}`
  );
  return response.data;
}

// 🔍 Get a single message by ID
export async function getMessageById(id: string) {
  const response = await api.get<Message>(`/messages/${id}`);
  return response.data;
}

export async function getConversation(userId: string) {
  const response = await api.get<MessagesByOtherUserDTO[]>(
    `/messages/conversation/${userId}`
  );
  return response.data;
}

// 📥 Get all messages
export async function getMessages() {
  const response = await api.get<Message[]>("/messages");
  return response.data;
}

// ✏️ Update a message
export async function updateMessage(id: string, data: UpdateMessageDto) {
  const response = await api.put<Message>(`/messages/${id}`, data);
  return response.data;
}

// 🗑️ Delete a message
export async function deleteMessage(id: string) {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
}
