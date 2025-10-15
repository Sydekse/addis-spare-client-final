// app/supplier/products/add/page.tsx or edit/page.tsx
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Eye, ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";

interface CompatibilityEntry {
  id: string;
  make: string;
  model: string;
  year: string;
}

const categories = [
  "Brakes",
  "Filters",
  "Engine",
  "Transmission",
  "Suspension",
  "Electrical",
  "Body",
  "Interior",
];

/* eslint-disable-next-line */
export default function ProductPage(props: any) {
  const id = props?.id ?? props?.params?.id;
  const mode = "edit";
  // Use `id` so the variable is not reported as unused by the linter
  // (actual fetch/use can be added later)
  console.debug("Editing product id:", id);
  const [formData, setFormData] = useState({
    name: mode === "edit" ? "Brake Pads Set - Honda Civic 2018-2023" : "",
    sku: mode === "edit" ? "BP-HC-001" : "",
    brand: mode === "edit" ? "Brembo" : "",
    description:
      mode === "edit"
        ? "High-performance ceramic brake pads designed for Honda Civic 2018-2023. Provides excellent stopping power and reduced brake dust."
        : "",
    category: mode === "edit" ? "Brakes" : "",
    price: mode === "edit" ? "4500" : "",
    stockQuantity: mode === "edit" ? "45" : "",
    reorderThreshold: mode === "edit" ? "10" : "",
    stockControlled: true,
    status: mode === "edit" ? "published" : "draft",
  });

  const [compatibility, setCompatibility] = useState<CompatibilityEntry[]>(
    mode === "edit"
      ? [{ id: "1", make: "Honda", model: "Civic", year: "2018-2023" }]
      : []
  );
  const [tags, setTags] = useState<string[]>(
    mode === "edit" ? ["ceramic", "performance", "low-dust"] : []
  );
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>(
    mode === "edit" ? ["/api/placeholder/200/200"] : []
  );

  const handleAddCompatibility = () => {
    setCompatibility([
      ...compatibility,
      { id: Date.now().toString(), make: "", model: "", year: "" },
    ]);
  };
  const handleUpdateCompatibility = (
    id: string,
    field: keyof CompatibilityEntry,
    value: string
  ) => {
    setCompatibility((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };
  const handleRemoveCompatibility = (id: string) =>
    setCompatibility((prev) => prev.filter((entry) => entry.id !== id));
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(
        () => "/api/placeholder/200/200"
      );
      setImages([...images, ...newImages]);
    }
  };
  const handleSave = (status: "draft" | "published") => {
    console.log("Saving product:", {
      ...formData,
      status,
      compatibility,
      tags,
      images,
    });
    // Redirect or show success
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Editing ${formData.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} className="gap-2">
            <Eye className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set pricing and manage stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
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
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stockQuantity}
                    disabled={!formData.stockControlled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Reorder Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={formData.reorderThreshold}
                    disabled={!formData.stockControlled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reorderThreshold: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="stock-controlled"
                  checked={formData.stockControlled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, stockControlled: checked })
                  }
                />
                <Label htmlFor="stock-controlled">
                  Track inventory for this product
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Compatibility</CardTitle>
              <CardDescription>
                Specify which vehicles this part fits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {compatibility.map((entry) => (
                <div key={entry.id} className="flex gap-3 items-end">
                  <div className="grid gap-3 md:grid-cols-3 flex-1">
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input
                        value={entry.make}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "make",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        value={entry.model}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "model",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year Range</Label>
                      <Input
                        value={entry.year}
                        onChange={(e) =>
                          handleUpdateCompatibility(
                            entry.id,
                            "year",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveCompatibility(entry.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddCompatibility}
                className="gap-2"
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
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload product photos (max 10 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-full h-32 object-cover rounded border"
                      width={200}
                      height={200}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() =>
                        setImages(images.filter((_, j) => j !== i))
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded cursor-pointer hover:border-primary/50">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add relevant tags for better searchability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
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
                />
                <Button variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Control product visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    Draft - Not visible to customers
                  </SelectItem>
                  <SelectItem value="published">
                    Published - Visible to customers
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
