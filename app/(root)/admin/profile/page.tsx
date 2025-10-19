"use client";

import { useState, ChangeEvent, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UpdateUserDto } from "@/types/user";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { updateUser } from "@/lib/api/services/user.service";

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.contact?.phone || "",
        address: user.contact?.address || "",
        city: user.contact?.city || "",
        country: user.contact?.country || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // export interface UpdateUserDto {
  //   email: string;
  //   name: string;
  //   contact: UserContact;
  // }

  //   export interface UserContact {
  //   phone: string;
  //   address: string;
  //   country: string;
  //   city: string;
  // }

  const handleSave = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      // Build the DTO in your expected format
      const updatedUserData: UpdateUserDto = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        contact: {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
        },
      };

      // 🧩 Call your backend update endpoint
      await updateUser(user.id, updatedUserData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.contact?.phone || "",
      address: user?.contact?.address || "",
      city: user?.contact?.city || "",
      country: user?.contact?.country || "",
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "supplier":
        return "bg-blue-100 text-blue-800";
      case "support":
        return "bg-orange-100 text-orange-800";
      case "customer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2"
              >
                <X className="h-4 w-4 mr-1 sm:mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2"
              >
                <Save className="h-4 w-4 mr-1 sm:mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto text-xs sm:text-sm py-2"
            >
              <Edit className="h-4 w-4 mr-1 sm:mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Profile Overview Card */}
        <Card className="grid md:grid-cols-2">
          <CardHeader className="border-b md:border-r flex flex-col items-center justify-center">
            <CardTitle className="text-lg sm:text-xl">
              {formData.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {formData.email}
            </CardDescription>
            <div className="flex justify-center gap-2 mt-3 sm:mt-4">
              <Badge
                className={getRoleColor(user?.role || "")}
                variant="secondary"
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "N/A"}
              </Badge>
              <Badge
                className={getStatusColor(user?.status || "")}
                variant="secondary"
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                {user?.status
                  ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                  : "N/A"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 flex justify-center items-center flex-col">
            <div>
              <Label className="text-xs text-muted-foreground">
                Member Since
              </Label>
              <p className="text-xs sm:text-sm mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Last Updated
              </Label>
              <p className="text-xs sm:text-sm mt-1">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm">
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-base sm:text-lg">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("name", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("email", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your email"
                    className="text-sm w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-base sm:text-lg">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("phone", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("city", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your city"
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("country", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter your country"
                    className="text-sm w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
