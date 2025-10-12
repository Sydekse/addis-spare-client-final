"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// -----------------
// Types
// -----------------
export type Category = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  level: number;
  productCount: number;
  children: Category[];
};

type CategoryNodeProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  expandedNodes: string[];
  toggleExpanded: (categoryId: string) => void;
};

// -----------------
// Mock Data
// -----------------
const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Engine Parts",
    description: "Internal combustion engine components and accessories",
    parentId: null,
    level: 0,
    productCount: 45,
    children: [
      {
        id: "cat-001-001",
        name: "Oil Filters",
        description: "Engine oil filtration systems",
        parentId: "cat-001",
        level: 1,
        productCount: 12,
        children: [],
      },
      {
        id: "cat-001-002",
        name: "Air Filters",
        description: "Engine air intake filtration",
        parentId: "cat-001",
        level: 1,
        productCount: 8,
        children: [],
      },
      {
        id: "cat-001-003",
        name: "Fuel System",
        description: "Fuel delivery and injection components",
        parentId: "cat-001",
        level: 1,
        productCount: 15,
        children: [
          {
            id: "cat-001-003-001",
            name: "Fuel Pumps",
            description: "Electric and mechanical fuel pumps",
            parentId: "cat-001-003",
            level: 2,
            productCount: 6,
            children: [],
          },
          {
            id: "cat-001-003-002",
            name: "Fuel Injectors",
            description: "Direct and port fuel injection systems",
            parentId: "cat-001-003",
            level: 2,
            productCount: 9,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "cat-002",
    name: "Brake Systems",
    description: "Braking components and hydraulic systems",
    parentId: null,
    level: 0,
    productCount: 32,
    children: [
      {
        id: "cat-002-001",
        name: "Brake Pads",
        description: "Friction material for disc brakes",
        parentId: "cat-002",
        level: 1,
        productCount: 18,
        children: [],
      },
      {
        id: "cat-002-002",
        name: "Brake Discs",
        description: "Brake rotors and discs",
        parentId: "cat-002",
        level: 1,
        productCount: 14,
        children: [],
      },
    ],
  },
  {
    id: "cat-003",
    name: "Suspension Systems",
    description: "Vehicle suspension and steering components",
    parentId: null,
    level: 0,
    productCount: 28,
    children: [
      {
        id: "cat-003-001",
        name: "Shock Absorbers",
        description: "Hydraulic and gas-filled dampers",
        parentId: "cat-003",
        level: 1,
        productCount: 16,
        children: [],
      },
      {
        id: "cat-003-002",
        name: "Springs",
        description: "Coil and leaf springs",
        parentId: "cat-003",
        level: 1,
        productCount: 12,
        children: [],
      },
    ],
  },
  {
    id: "cat-004",
    name: "Electrical Components",
    description: "Automotive electrical and electronic parts",
    parentId: null,
    level: 0,
    productCount: 22,
    children: [
      {
        id: "cat-004-001",
        name: "Batteries",
        description: "Starting and deep cycle batteries",
        parentId: "cat-004",
        level: 1,
        productCount: 8,
        children: [],
      },
      {
        id: "cat-004-002",
        name: "Alternators",
        description: "Charging system components",
        parentId: "cat-004",
        level: 1,
        productCount: 6,
        children: [],
      },
      {
        id: "cat-004-003",
        name: "Lighting",
        description: "Headlights, tail lights, and indicators",
        parentId: "cat-004",
        level: 1,
        productCount: 8,
        children: [],
      },
    ],
  },
];

// -----------------
// Category Node
// -----------------
function CategoryNode({
  category,
  onEdit,
  onDelete,
  expandedNodes,
  toggleExpanded,
}: CategoryNodeProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedNodes.includes(category.id);

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={() => toggleExpanded(category.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-6" />}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-5 w-5 text-blue-600" />
            ) : (
              <Folder className="h-5 w-5 text-blue-600" />
            )
          ) : (
            <div className="h-5 w-5 border rounded border-gray-300" />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">{category.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {category.productCount} products
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{category.name}"?
                  {hasChildren && " This will also delete all subcategories."}
                  {category.productCount > 0 &&
                    ` This category contains ${category.productCount} products.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-8 space-y-2">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedNodes={expandedNodes}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------
// Main Component
// -----------------
export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([
    "cat-001",
    "cat-002",
    "cat-003",
    "cat-004",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const toggleExpanded = (categoryId: string) => {
    setExpandedNodes((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
  };

  const handleDelete = (categoryId: string) => {
    // TODO: replace with API call
    console.log(`Deleting category: ${categoryId}`);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      description: newCategoryDescription,
      parentId: null,
      level: 0,
      productCount: 0,
      children: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setIsAddDialogOpen(false);
  };

  const getTotalProducts = (): number => {
    const countProducts = (cats: Category[]): number =>
      cats.reduce(
        (total, cat) =>
          total + cat.productCount + countProducts(cat.children ?? []),
        0
      );
    return countProducts(categories);
  };

  const getTotalCategories = (): number => {
    const countCategories = (cats: Category[]): number =>
      cats.reduce(
        (total, cat) =>
          total + 1 + countCategories(cat.children ?? []),
        0
      );
    return countCategories(categories);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Category Management</h1>
          <p className="text-muted-foreground">
            Organize product catalog into structured categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category to organize your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  placeholder="Enter category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter category description..."
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalCategories()}</div>
            <p className="text-xs text-muted-foreground">
              Including subcategories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Top-level categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalProducts()}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>
            Manage product categories and subcategories. Click the expand/collapse
            icons to navigate the hierarchy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
                expandedNodes={expandedNodes}
                toggleExpanded={toggleExpanded}
              />
            ))}

            {categories.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No categories found</h3>
                <p>Start by creating your first product category.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <Dialog
          open={!!selectedCategory}
          onOpenChange={() => setSelectedCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // TODO: update category in state
                    setSelectedCategory(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
