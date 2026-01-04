import api from "../client";
import type {
  CreateSettingDto,
  UpdateCurrencySettingsDto,
  UpdateTaxSettingsDto,
  ChangeNotificationDto,
  DeliveryZoneUpdateDto,
  UserPermissionSettingUpdateDto,
} from "@/types/settings";

export async function createSettings(data: CreateSettingDto) {
  const response = await api.post<void>("/settings/create", data);
  return response.data;
}

export async function updateUserPermissions(
  data: UserPermissionSettingUpdateDto
) {
  const response = await api.post("/settings/update-permissions", data);
  return response.data;
}

export async function updateNotificationSettings(data: ChangeNotificationDto) {
  const response = await api.post("/settings/update-notification", data);
  return response.data;
}

export async function updateCurrencySettings(data: UpdateCurrencySettingsDto) {
  const response = await api.post("/settings/update-currency", data);
  return response.data;
}

export async function updateDeliveryZones(data: DeliveryZoneUpdateDto) {
  const response = await api.post("/settings/update-delivery-zones", data);
  return response.data;
}

export async function updateTaxSettings(data: UpdateTaxSettingsDto) {
  const response = await api.post("/settings/update-tax", data);
  return response.data;
}
