"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  User,
  FileText,
  Upload,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/lib/cloudinary/uploadImage";
import { useAuth } from "@/hooks/use-auth";
import { findUserById } from "@/lib/api/services/user.service";
import { updateSupplier } from "@/lib/api/services/supplier.service";

interface FormData {
  businessName: string;
  businessType: string;
  taxId: string;
  establishedYear: string;
  numberOfEmployees: string;
  website: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  street: string;
  building: string;
  city: string;
  country: string;
  businessDescription: string;
  specializations: string[];
  licenseType: string;
  licenseNumber: string;
  uploadedFiles: string[];
  existingFiles?: string[];
}

const businessTypes = [
  "Distributor",
  "Manufacturer",
  "Retailer",
  "Wholesaler",
  "Service Provider",
];

const specializationOptions = [
  "Brake Systems",
  "Engine Parts",
  "Electrical Components",
  "Suspension Systems",
  "Transmission Parts",
  "Body Parts",
  "Interior Components",
  "Exhaust Systems",
];

const licenseTypes = [
  "Trade License",
  "Import License",
  "Export License",
  "Manufacturing License",
  "Distribution License",
];

export default function Page() {
  const router = useRouter();
  const { uploadRawFile, loading } = useCloudinaryUpload();
  const { user } = useAuth(true);

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    taxId: "",
    establishedYear: "",
    numberOfEmployees: "",
    website: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    street: "",
    building: "",
    city: "",
    country: "",
    businessDescription: "",
    specializations: [],
    licenseType: "",
    licenseNumber: "",
    uploadedFiles: [],
    existingFiles: [],
  });

  const [activeTab, setActiveTab] = useState("business");

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const newUser = await findUserById(user!.id);
      const details = newUser.supplierDetails;

      if (!details) return;

      setFormData({
        businessName: details.businessName || "",
        businessType: details.businessType || "",
        taxId: details.taxId || "",
        establishedYear: details.establishedYear || "",
        numberOfEmployees: details.numberOfEmployees || "",
        website: details.website || "",
        contactPersonName: details.contactPersonName || "",
        contactEmail: details.contactEmail || "",
        contactPhone: details.contactPhone || "",
        street: details.street || "",
        building: details.building || "",
        city: details.city || "",
        country: details.country || "",
        businessDescription: details.businessDescription || "",
        specializations: details.specializations || [],
        licenseType: details.licenseType || "",
        licenseNumber: details.licenseNumber || "",
        uploadedFiles: details.uploadedFiles || [],
        existingFiles: details.uploadedFiles || [],
      });
    };

    if (user?.supplierDetails) {
      fetchSupplierDetails();
    }
  }, [user]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[] | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      for (const file of files) {
        try {
          const data = await uploadRawFile(file);
          if (data?.secure_url) {
            setFormData((prev) => ({
              ...prev,
              uploadedFiles: [...prev.uploadedFiles, data.secure_url],
              existingFiles: [...(prev.existingFiles || []), data.secure_url],
            }));
          }
        } catch (err) {
          console.log(err);
          toast.error("Unable to upload file");
        }
      }

      e.target.value = ""; // reset input
    }
  };

  const handleSave = async () => {
    console.log("Saving supplier profile:", formData);
    const newUser = await updateSupplier(user?.id as string, formData);
    console.log("Updated supplier user:", newUser);
    toast.success("Profile updated successfully!");
    // router.push("/supplier");
  };

  const handleCancel = () => {
    router.push("/supplier");
  };

  const validateForm = (): boolean => {
    return !!(
      formData.businessName &&
      formData.businessType &&
      formData.taxId &&
      formData.establishedYear &&
      formData.contactPersonName &&
      formData.contactEmail &&
      formData.contactPhone &&
      formData.street &&
      formData.city &&
      formData.country &&
      formData.businessDescription &&
      formData.specializations.length > 0 &&
      formData.licenseType &&
      formData.licenseNumber &&
      (formData.uploadedFiles || formData.existingFiles)
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                Edit Supplier Profile
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Update your business information and settings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none text-sm py-2"
                >
                  <X className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Discard</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to discard
                    them? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    Discard Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={handleSave}
              disabled={!validateForm()}
              className="flex-1 sm:flex-none text-sm py-2"
            >
              <Save className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Save</span>
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Building2 className="w-5 h-5" />
              <span>Supplier Information</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your business profile, contact information, and licensing
              details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 sm:grid-cols-4 overflow-x-auto w-full">
                <TabsTrigger
                  value="business"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Business</span>
                  <span className="hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Contact</span>
                  <span className="hidden">Person</span>
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Details</span>
                  <span className="hidden">Desc</span>
                </TabsTrigger>
                <TabsTrigger
                  value="licenses"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Licenses</span>
                  <span className="hidden">Docs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="business"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Auto Parts Co."
                        value={formData.businessName}
                        onChange={(e) =>
                          handleInputChange("businessName", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) =>
                          handleInputChange("businessType", value)
                        }
                      >
                        <SelectTrigger className="mt-1 w-full text-sm">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID / VAT Number *</Label>
                      <Input
                        id="taxId"
                        placeholder="123-45-6789"
                        value={formData.taxId}
                        onChange={(e) =>
                          handleInputChange("taxId", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="establishedYear">
                        Established Year *
                      </Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        placeholder="2010"
                        value={formData.establishedYear}
                        onChange={(e) =>
                          handleInputChange("establishedYear", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="numberOfEmployees">
                        Number of Employees
                      </Label>
                      <Input
                        id="numberOfEmployees"
                        placeholder="1-10"
                        value={formData.numberOfEmployees}
                        onChange={(e) =>
                          handleInputChange("numberOfEmployees", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="contact"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg">Contact Person</h3>
                    <div>
                      <Label htmlFor="contactPersonName">Full Name *</Label>
                      <Input
                        id="contactPersonName"
                        placeholder="John Doe"
                        value={formData.contactPersonName}
                        onChange={(e) =>
                          handleInputChange("contactPersonName", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email Address *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          handleInputChange("contactPhone", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg">Business Address</h3>
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        placeholder="123 Business Ave"
                        value={formData.street}
                        onChange={(e) =>
                          handleInputChange("street", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="building">Building/Suite</Label>
                      <Input
                        id="building"
                        placeholder="Suite 100"
                        value={formData.building}
                        onChange={(e) =>
                          handleInputChange("building", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className="mt-1 w-full text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          className="mt-1 w-full text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="details"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessDescription">
                      Business Description *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Describe your business, products, and services..."
                      value={formData.businessDescription}
                      onChange={(e) =>
                        handleInputChange("businessDescription", e.target.value)
                      }
                      className="mt-1 min-h-[100px] sm:min-h-[120px] text-sm"
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Tell customers about your business, experience, and what
                      makes you unique.
                    </p>
                  </div>
                  <div>
                    <Label>Specializations *</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Select all categories that apply to your business
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {specializationOptions.map((spec) => (
                        <Badge
                          key={spec}
                          variant={
                            formData.specializations.includes(spec)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer text-xs sm:text-sm py-1 px-2 hover:opacity-80 transition-opacity"
                          onClick={() => handleSpecializationToggle(spec)}
                        >
                          {formData.specializations.includes(spec) && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="licenses"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="licenseType">License Type *</Label>
                      <Select
                        value={formData.licenseType}
                        onValueChange={(value) =>
                          handleInputChange("licenseType", value)
                        }
                      >
                        <SelectTrigger className="mt-1 w-full text-sm">
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                        <SelectContent>
                          {licenseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">License Number *</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="LIC-123456789"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          handleInputChange("licenseNumber", e.target.value)
                        }
                        className="mt-1 w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <Label htmlFor="licenseFiles">License Documents</Label>
                    <div className="mt-2 space-y-3">
                      <label
                        htmlFor="licenseFiles"
                        className="flex flex-col items-center justify-center w-full p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-primary hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-2" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Tap to upload
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PDF, JPG, PNG (Max 10MB)
                        </span>
                        <Input
                          id="licenseFiles"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>

                      {/* List of uploaded files */}
                      {formData.existingFiles &&
                        formData.existingFiles.length > 0 && (
                          <div className="space-y-2">
                            {formData.existingFiles.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <span className="text-xs sm:text-sm text-blue-700 truncate max-w-[80%]">
                                  {typeof file === "string"
                                    ? file.split("/").pop()
                                    : file}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-blue-600 border-blue-300 text-xs"
                                >
                                  Uploaded
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
