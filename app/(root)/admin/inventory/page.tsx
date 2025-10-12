"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  Warehouse,
  Bell,
  Eye,
} from "lucide-react";
import { Inventory } from "@/types/inventory";
import { getInventories } from "@/lib/api/services/inventory.service";

type StockStatus = {
  badge: React.ReactNode;
  level: "out" | "low" | "adequate";
};

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "all" || item.location === locationFilter;

    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = item.quantity <= item.reorderTreshould;
    } else if (stockFilter === "out") {
      matchesStock = item.quantity === 0;
    } else if (stockFilter === "adequate") {
      matchesStock = item.quantity > item.reorderTreshould;
    }

    return matchesSearch && matchesLocation && matchesStock;
  });

  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventories();
      setInventory(inventories);
    }

    fetchInventories()
  }, [])

  const getStockStatus = (quantity: number, threshold: number): StockStatus => {
    if (quantity === 0) {
      return { badge: <Badge variant="destructive">Out of Stock</Badge>, level: "out" };
    } else if (quantity <= threshold) {
      return { badge: <Badge variant="outline" className="text-yellow-600">Low Stock</Badge>, level: "low" };
    } else {
      return { badge: <Badge variant="outline" className="text-green-600">In Stock</Badge>, level: "adequate" };
    }
  };


  const getLowStockItems = () => inventory.filter((item) => item.quantity <= item.reorderTreshould);
  const getOutOfStockItems = () => inventory.filter((item) => item.quantity === 0);
  const getTotalValue = () =>
    inventory.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const uniqueLocations = [...new Set(inventory.map((item) => item.location))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">
            Monitor stock levels and manage inventory across all locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" /> Notify Suppliers
          </Button>
          <Button variant="outline">Export Inventory</Button>
          <Button>Adjust Stock</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getLowStockItems().length}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getOutOfStockItems().length}</div>
            <p className="text-xs text-muted-foreground">Urgent restocking needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {getTotalValue()}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>{filteredInventory.length} of {inventory.length} items shown</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="adequate">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.reorderTreshould);
                  return (
                    <TableRow
                      key={item.id}
                      className={stockStatus.level === "out" ? "bg-red-50" : stockStatus.level === "low" ? "bg-yellow-50" : ""}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{item.product.sku}</div>
                          <div className="text-sm text-muted-foreground">{item.product.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.quantity} units</div>
                          <div className="text-sm text-muted-foreground">Reorder at {item.reorderTreshould}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">{stockStatus.badge}</div>
                      </TableCell>
                      <TableCell>{item.product.brand}</TableCell>
                      <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No inventory items found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inventory Management</DialogTitle>
              <DialogDescription>stock levels for {selectedItem.product.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div><label className="text-sm font-medium">Product Name</label><p className="text-sm text-muted-foreground">{selectedItem.product.name}</p></div>
                <div><label className="text-sm font-medium">SKU</label><p className="text-sm text-muted-foreground font-mono">{selectedItem.product.sku}</p></div>
                <div><label className="text-sm font-medium">Category</label><p className="text-sm text-muted-foreground">{selectedItem.product.category}</p></div>
                <div><label className="text-sm font-medium">Location</label><p className="text-sm text-muted-foreground">{selectedItem.location}</p></div>
                <div><label className="text-sm font-medium">Supplier</label><p className="text-sm text-muted-foreground">{selectedItem.product.brand}</p></div>
                <div><label className="text-sm font-medium">Last Updated</label><p className="text-sm text-muted-foreground">{new Date(selectedItem.lastUpdated).toLocaleDateString()}</p></div>
              </div>

              {/* Stock Update */}
              {/* <div>
                <label className="text-sm font-medium">Update Quantity</label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" placeholder="New quantity" id="quantity-input" className="flex-1" />
                  <Button onClick={() => {
                    const input = document.getElementById("quantity-input") as HTMLInputElement;
                    const newQuantity = parseInt(input.value);
                    if (!isNaN(newQuantity) && newQuantity >= 0) {
                      handleQuantityUpdate(selectedItem.id, newQuantity);
                      setSelectedItem({ ...selectedItem, quantity: newQuantity });
                    }
                  }}>Update</Button>
                </div>
              </div> */}

              {/* <div>
                <label className="text-sm font-medium">Reorder Threshold</label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" placeholder="Reorder threshold" defaultValue={selectedItem.reorderThresholud} id="threshold-input" className="flex-1" />
                  <Button onClick={() => {
                    const input = document.getElementById("threshold-input") as HTMLInputElement;
                    const newThreshold = parseInt(input.value);
                    if (!isNaN(newThreshold) && newThreshold >= 0) {
                      handlereorderThresholudUpdate(selectedItem.id, newThreshold);
                      setSelectedItem({ ...selectedItem, reorderThresholud: newThreshold });
                    }
                  }}>Update</Button>
                </div>
              </div> */}

              {/* Pricing Info */}
              <div className="border-t pt-4">
                <h4>Pricing Information</h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div><label className="text-sm font-medium">Supplier Price</label><p className="text-sm text-muted-foreground">ETB {selectedItem.product.price}</p></div>
                  <div><label className="text-sm font-medium">Selling Price</label><p className="text-sm text-muted-foreground">ETB {selectedItem.product.price}</p></div>
                  <div><label className="text-sm font-medium">Current Stock Value</label><p className="text-sm text-muted-foreground">ETB {selectedItem.quantity * selectedItem.product.price}</p></div>
                  <div><label className="text-sm font-medium">Profit Margin</label><p className="text-sm text-muted-foreground">{(((selectedItem.product.price - selectedItem.product.price)/selectedItem.product.price)*100).toFixed(1)}%</p></div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
