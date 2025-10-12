import api from "../client";
import type {
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
  User,
} from "@/types/user";

// 🆕 Create a new user
export async function createUser(data: CreateUserDto): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response.data;
}

// 🔍 Find a user by ID
export async function findUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

// 📝 Update a user
export async function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

// 🗑 Delete a user
export async function deleteUser(data: DeleteUserDto): Promise<{ success: boolean }> {
  const response = await api.post<{ success: boolean }>("/users/delete", data);
  return response.data;
}

// 📋 Get all users
export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}
