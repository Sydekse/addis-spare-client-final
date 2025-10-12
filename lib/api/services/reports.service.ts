import api from "../client";
import type { Report, CreateReportDto, UpdateReportDto } from "@/types/report";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { Inventory } from "@/types/inventory";

// ➕ Create a new report
export async function createReport(data: CreateReportDto) {
  const response = await api.post<Report>("/reports", data);
  return response.data;
}

// 📊 Generate a report (could return products, orders, or inventories)
export async function generateReport(id: string) {
  const response = await api.get<Product[] | Order[] | Inventory[]>(`/reports/${id}/generate`);
  return response.data;
}

// 🔍 Get a single report by ID
export async function getReportById(id: string) {
  const response = await api.get<Report>(`/reports/${id}`);
  return response.data;
}

// 📑 Get all reports
export async function getReports() {
  const response = await api.get<Report[]>("/reports");
  return response.data;
}

// ✏️ Update a report
export async function updateReport(id: string, data: UpdateReportDto) {
  const response = await api.put<Report>(`/reports/${id}`, data);
  return response.data;
}

// 🗑️ Delete a report
export async function deleteReport(id: string) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}
