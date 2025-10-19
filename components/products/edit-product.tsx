"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { X, Plus, Save, ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Product, UpdateProductDto } from "@/types/product";
import { updateProduct } from "@/lib/api/services/product.service";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/lib/cloudinary/uploadImage";

const categories = [
  "Brakes",
  "Filters",
  "Engine",
  "Transmission",
  "Suspension",
  "Electrical",
  "Body",
  "Interior",
  "Other",
];

type CompatibilityData = {
  id: number;
  make: string;
  model: string;
  year: number;
};

export default function EditProduct({ product }: { product: Product }) {
  console.debug("Editing product id:", product.id);
  const [formData, setFormData] = useState({
    name: product.name || "",
    sku: product.sku || "",
    brand: product.brand || "",
    description: product.description || "",
    category: product.category || "Electrical",
    price: product.price?.toString() || "",
    stockQuantity: "",
    reorderThreshold: "",
    stockControlled: product.stockControlled ?? true,
    status: product.status || "draft",
  });

  const { uploadImage } = useCloudinaryUpload();

  const [compatibility, setCompatibility] = useState<CompatibilityData[]>(
    product.compatibility?.map((c, idx) => ({
      id: idx,
      make: c.make || "",
      model: c.model || "",
      year: c.year,
    })) || []
  );
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>(product.images || []);

  const handleAddCompatibility = () => {
    setCompatibility([
      ...compatibility,
      { id: compatibility.length + 1, make: "", model: "", year: 0 },
    ]);
  };

  const handleUpdateCompatibility = (
    id: number,
    field: keyof CompatibilityData,
    value: string
  ) => {
    setCompatibility((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleRemoveCompatibility = (id: number) =>
    setCompatibility((prev) => prev.filter((entry) => entry.id !== id));

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      for (const file of files) {
        try {
          const data = await uploadImage(file);
          if (data?.secure_url) {
            setImages((prev) => [...prev, data.secure_url]);
          }
        } catch (err) {
          // Log error for debugging
          console.error("Image upload failed:", err);
          toast.error("Unable to upload image");
        }
      }

      // reset input so same file can be uploaded again if needed
      e.target.value = "";
    }
  };
  //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files) {
  //       const newImages = Array.from(e.target.files).map(
  //         () => "/api/placeholder/200/200"
  //       );
  //       setImages([...images, ...newImages]);
  //     }
  //   };

  const handleSave = async () => {
    const saveData = {
      ...formData,
      compatibility: compatibility.map(({ ...rest }) => rest),
      tags,
      price: Number(formData.price),
      images,
    };
    console.log("Saving product:", saveData);
    const updateProductDto: UpdateProductDto = saveData as UpdateProductDto;
    const newProduct = await updateProduct(product.id, updateProductDto);
    console.log(`Product updated: `, newProduct);
    toast.message("Product updated successfully");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Edit Product
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Editing {formData.name || "Product"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={() => handleSave()}
            className="flex-1 sm:flex-none gap-2 text-white transition-all"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set product pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Compatibility */}
          <Card className="shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Vehicle Compatibility
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Specify which vehicles this part fits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {compatibility.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
                >
                  <div className="grid gap-3 sm:grid-cols-3 flex-1">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Make</Label>
                      <Input
                        value={entry.make}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "make",
                            e.target.value
                          )
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Model</Label>
                      <Input
                        value={entry.model}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "model",
                            e.target.value
                          )
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Year Range</Label>
                      <Input
                        value={entry.year}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "year",
                            e.target.value
                          )
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveCompatibility(entry.id)}
                    className="border-gray-300 dark:border-gray-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddCompatibility}
                className="w-full sm:w-auto gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Compatibility
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <Card className="shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Images
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Upload product photos (max 10 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded border border-gray-200 dark:border-gray-700 transition-transform group-hover:scale-105"
                      width={200}
                      height={200}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setImages(images.filter((_, j) => j !== i))
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex flex-col items-center justify-center h-24 sm:h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Upload Image
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Tags
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Add relevant tags for better searchability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Button
                  variant="outline"
                  onClick={handleAddTag}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
