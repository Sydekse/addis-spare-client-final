'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Globe, DollarSign, Truck, Users, Shield, Bell } from 'lucide-react';
import { createSettings, updateCurrencySettings, updateNotificationSettings, updateTaxSettings, updateDeliveryZones, updateUserPermissions } from "@/lib/api/services/settings.service";
import { type SystemSettings, type TaxRule, type DeliveryZone, type CurrencySettings, type NotificationSettings, type UserPermission, TaxType } from "@/types/settings";

export default function PlatformSettingsPage() {
  // Default mock data mapped to SystemSettings interface
  const [settings, setSettings] = useState<SystemSettings>({
    id: "1",
    userId: '',
    taxRules: { region: "Ethiopia", taxRate: 18, taxType: TaxType.VAT, isActive: true },
    deliveryZones: {
      zoneId: "zone1",
      zoneName: "Addis Ababa",
      deliveryFee: 15,
      estimatedDeliveryDays: 2,
      supportedAreas: ["Addis Ababa"],
    },
    userPermissions: {
      role: "admin",
      permissions: {
        canManageProducts: true,
        canProcessOrders: true,
        canManageUsers: true,
        canConfigureSystem: true,
      },
    },
    currencySettings: { primaryCurrency: "ETB", secondaryCurrency: "USD", exchangeRate: 53.5, exchangeRateUpdatedAt: new Date() },
    notificationSettings: { orderConfirmation: true, shippingUpdates: true, promotional: true, lowStockAlerts: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Handler to update nested keys
  const handleChange = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      await createSettings(settings as any); // map to API payload
      await updateCurrencySettings({ userId: settings.userId, currencySettings: settings.currencySettings });
      await updateNotificationSettings({ userId: settings.userId, notificationSetting: settings.notificationSettings });
      await updateTaxSettings({ userId: settings.userId, taxRule: settings.taxRules });
      await updateDeliveryZones({ userId: settings.userId, deliveryZone: settings.deliveryZones });
      await updateUserPermissions({ userId: settings.userId, userPermissions: settings.userPermissions });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Platform Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and business rules</p>
        </div>
        <Button onClick={saveSettings}>Save Changes</Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />General Settings</CardTitle>
          <CardDescription>Basic platform configuration and localization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Name</label>
              <Input
                value={settings.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Financial Settings</CardTitle>
          <CardDescription>Tax rates, currency, and payment gateways</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <Input
                type="number"
                value={settings.taxRules.taxRate}
                onChange={(e) => handleChange("taxRules", { ...settings.taxRules, taxRate: parseFloat(e.target.value) })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tax Type</label>
              <Select
                value={settings.taxRules.taxType}
                onValueChange={(value) => handleChange("taxRules", { ...settings.taxRules, taxType: value as any })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vat">VAT</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Currency Settings</CardTitle>
          <CardDescription>Primary and secondary currencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Primary Currency</label>
              <Input
                value={settings.currencySettings.primaryCurrency}
                onChange={(e) => handleChange("currencySettings", { ...settings.currencySettings, primaryCurrency: e.target.value as any })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secondary Currency</label>
              <Input
                value={settings.currencySettings.secondaryCurrency || ""}
                onChange={(e) => handleChange("currencySettings", { ...settings.currencySettings, secondaryCurrency: e.target.value || null })}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Settings</CardTitle>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">{key}</label>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) =>
                  handleChange("notificationSettings", { ...settings.notificationSettings, [key]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" />Delivery Zones</CardTitle>
          <CardDescription>Configure delivery areas and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{settings.deliveryZones.zoneName}</div>
              <div className="text-sm text-muted-foreground">
                Fee: {settings.deliveryZones.deliveryFee} ETB • {settings.deliveryZones.estimatedDeliveryDays} days
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Active</Badge>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />User Permissions</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
          {Object.entries(settings.userPermissions.permissions).map(([perm, value]) => (
            <div key={perm} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">{perm}</label>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) =>
    handleChange("userPermissions", {
                    ...settings.userPermissions,
                    permissions: { ...settings.userPermissions.permissions, [perm]: checked },
                  })                }
              />
            </div>
          ))}
        </CardContent>
         
      </Card>
    </div>
  );
}