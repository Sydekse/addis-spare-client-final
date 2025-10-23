"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/types/inventory";
import { Product } from "@/types/product";
import {
  deleteInventory,
  getInventoryByProduct,
  updateInventory,
  createInventory,
} from "@/lib/api/services/inventory.service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface ProductInventoriesProps {
  product: Product;
}

export default function ProductInventories({
  product,
}: ProductInventoriesProps) {
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const { user } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventoryByProduct(product.id);
      setInventories(inventories);
    };
    fetchInventories();
  }, [product.id]);

  const [formData, setFormData] = useState<CreateInventoryDto>({
    productId: product.id,
    location: "",
    quantity: 0,
    reorderTreshold: 0,
    supplierId: user?.id,
  });

  const handleInputChange = (field: string, value: unknown) => {
    const normalizedValue =
      typeof value === "string" && value.trim() === "" ? "" : value;
    if (field === "reorderTreshould" || field === "reorderThreshold") {
      setFormData((prev) => {
        return { ...prev, reorderTreshould: Number(normalizedValue) };
      });
    } else setFormData((prev) => ({ ...prev, [field]: normalizedValue }));
  };

  // Add inventory locally and via API
  const handleAddInventory = async () => {
    try {
      const newInventory = await createInventory(formData);
      setInventories((prev) => [...prev, newInventory]);
      toast.success("Inventory added successfully");
      setAddDialogOpen(false);
      setFormData({
        productId: product.id,
        location: "",
        quantity: 0,
        reorderTreshold: 0,
        supplierId: user?.id,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add inventory");
    }
  };

  // Delete inventory locally and via API
  const handleDeleteInventory = async (id: string) => {
    try {
      await deleteInventory(id);
      setInventories((prev) => prev.filter((inv) => inv.id !== id));
      toast.success("Inventory deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inventory");
    }
  };

  // Edit inventory locally and via API
  const handleEditInventory = async () => {
    if (!selectedInventory) return;

    try {
      const updatedInventory = await updateInventory(
        selectedInventory.id,
        formData as UpdateInventoryDto
      );
      setInventories((prev) =>
        prev.map((inv) =>
          inv.id === selectedInventory.id ? updatedInventory : inv
        )
      );
      toast.success("Inventory updated successfully");
      setSelectedInventory(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update inventory");
    }
  };

  return (
    <>
      <TabsContent value="inventories" className="mt-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Product Inventories</h3>
          <Button onClick={() => setAddDialogOpen(true)}>
            Add New Inventory
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">
                    Reorder Threshold
                  </TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventories.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.location}</TableCell>
                    <TableCell className="text-center">
                      {inv.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {inv.reorderTreshould}
                    </TableCell>
                    <TableCell>{inv.supplierId || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInventory(inv);
                            setFormData({
                              productId: inv.productId,
                              location: inv.location,
                              quantity: inv.quantity,
                              reorderTreshold: inv.reorderTreshould,
                              supplierId: inv.supplierId,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteInventory(inv.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Add Inventory Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Inventory</DialogTitle>
            <DialogDescription>
              Provide inventory details for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                handleInputChange("quantity", parseInt(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="Reorder Threshold"
              value={formData.reorderTreshold}
              onChange={(e) =>
                handleInputChange("reorderThreshold", parseInt(e.target.value))
              }
            />
            <Input
              placeholder="Supplier ID (optional)"
              value={formData.supplierId}
              disabled
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddInventory}>Add Inventory</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Inventory Dialog */}
      {selectedInventory && (
        <Dialog
          open={!!selectedInventory}
          onOpenChange={() => setSelectedInventory(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Inventory</DialogTitle>
              <DialogDescription>
                Update inventory details for this product.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Reorder Threshold"
                value={formData.reorderTreshold}
                onChange={(e) =>
                  handleInputChange(
                    "reorderThreshold",
                    parseInt(e.target.value)
                  )
                }
              />
              <Input
                placeholder="Supplier ID (optional)"
                value={formData.supplierId}
                disabled
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInventory(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditInventory}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
