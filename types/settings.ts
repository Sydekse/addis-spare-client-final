export enum TaxType {
  VAT = 'vat',
  SALES = 'sales',
  IMPORT = 'import',
}

export interface TaxRule {
  region: string;
  taxRate: number;
  taxType: TaxType;
  isActive: boolean;
}

export interface DeliveryZone {
  zoneId: string;
  zoneName: string;
  deliveryFee: number;
  estimatedDeliveryDays: number;
  supportedAreas: string[];
}

export interface UserPermission {
  role: string; // Replace with UserRole if defined elsewhere
  permissions: {
    canManageProducts: boolean;
    canProcessOrders: boolean;
    canManageUsers: boolean;
    canConfigureSystem: boolean;
  };
}

export interface CurrencySettings {
  primaryCurrency: 'ETB';
  secondaryCurrency: string | null;
  exchangeRate: number | null;
  exchangeRateUpdatedAt: Date | null;
}

export interface NotificationSettings {
  orderConfirmation: boolean;
  shippingUpdates: boolean;
  promotional: boolean;
  lowStockAlerts: boolean;
}

export interface NotificationSettingDto extends NotificationSettings {}

export interface CurrencySettingsDto extends CurrencySettings {}

export interface DeliveryZoneDto {
  primaryCurrency: string;
  exchangeRate: number;
  exchangeRateUpdatedAt: Date;
}

export interface DeliveryZoneUpdateDto {
  userId: string;
  deliveryZone: DeliveryZone;
}

export interface ChangeNotificationDto {
  userId: string;
  notificationSetting: NotificationSettings;
}

export interface UserPermissionSettingUpdateDto {
  userId: string;
  userPermissions: UserPermission;
}

export interface UpdateCurrencySettingsDto {
  userId: string;
  currencySettings: CurrencySettings;
}

export interface UpdateTaxSettingsDto {
  userId: string;
  taxRule: TaxRule;
}

export interface CreateSettingDto {
  id: string;
  userId: string;
  taxRules: TaxRule;
  deliveryZones: DeliveryZone;
  userPermissions: UserPermission;
  deliveryZone: DeliveryZone;
  currencySettings: CurrencySettings;
  notificationSettings: NotificationSettings;
}

export interface SystemSettings {
  id: string;
  userId: string;
  taxRules: TaxRule;
  deliveryZones: DeliveryZone;
  userPermissions: UserPermission;
  currencySettings: CurrencySettings;
  notificationSettings: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}
