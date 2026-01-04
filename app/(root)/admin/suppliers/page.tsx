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
import { Textarea } from "@/components/ui/textarea";

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
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  X,
  Eye,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
} from "lucide-react";
import { User } from "@/types/user";
import {
  getSuppliers,
  verifySupplier,
} from "@/lib/api/services/supplier.service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { CreateMessageDto, Message } from "@/types/messages";
import { createMessage } from "@/lib/api/services/message.service";

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   passwordHash: string;
//   contact: UserContact | null;
//   status: string;
//   role: UserRole;
//   createdAt: Date;
//   updatedAt: Date;
//   supplierDetails?: SupplierDetails;
// }

// export interface SupplierDetails {
//   businessName?: string;
//   businessType?: string;
//   taxId?: string;
//   establishedYear?: string;
//   numberOfEmployees?: string;
//   website?: string;

//   contactPersonName?: string;
//   contactEmail?: string;
//   contactPhone?: string;
//   street?: string;
//   building?: string;
//   city?: string;
//   country?: string;

//   isVerified?: boolean;

//   businessDescription?: string;
//   specializations?: string[];

//   licenseType?: string;
//   licenseNumber?: string;
//   uploadedFiles?: string[];
// }

export default function Page() {
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliers = await getSuppliers();
      setSuppliers(suppliers);
    };

    fetchSuppliers();
  }, []);
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [supplierToReject, setSupplierToReject] = useState<User | null>(null);

  const handleApproveSupplier = async (supplierId: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
    console.log(`Supplier ${supplierId} approved`);
    await verifySupplier(supplierId);
    toast.success("Supplier approved successfully");
  };

  const handleRejectSupplier = async () => {
    if (!supplierToReject || !rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to contact the seller");
      return;
    }

    const receiverId = supplierToReject.id;
    const senderId = user.id;

    try {
      // ✉️ Construct a formal rejection message
      const formalMessage = `
Dear ${supplierToReject.supplierDetails?.contactPersonName || supplierToReject.name},

We appreciate the time and effort you invested in applying to become a registered supplier with our platform. After a careful review of your application and the information provided, we regret to inform you that we are unable to approve your registration at this time.

${rejectionReason.trim()}

This decision does not preclude you from reapplying in the future. We encourage you to review our supplier requirements and submit a new application once the outlined concerns have been addressed.

We thank you once again for your interest and wish you success in your future endeavors.

Kind regards,  
${user.name || "Procurement Review Team"}  
Procurement Department  
`;

      // Prepare message payload
      const messageDto: CreateMessageDto = {
        conversationId: "",
        senderId,
        recipientId: receiverId,
        body: formalMessage,
        attachments: [],
      };

      const createdMessage: Message = await createMessage(messageDto);
      console.log("The sent message is:", createdMessage);

      toast.success("Formal rejection message sent to supplier");

      // Remove rejected supplier from the list
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== supplierToReject.id)
      );

      // Reset dialog + state
      setShowRejectionDialog(false);
      setSupplierToReject(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Failed to reject supplier:", error);
      toast.error("Failed to send rejection message. Please try again.");
    }
  };

  const initiateRejection = (supplier: User) => {
    setSupplierToReject(supplier);
    setShowRejectionDialog(true);
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex justify-between items-center">
        <div>
          <h1>Supplier Approval Queue</h1>
          <p className="text-muted-foreground">
            Review and approve new supplier applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {suppliers.length} Pending Applications
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                suppliers.filter(
                  (s) =>
                    new Date(s.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Supplier Applications</CardTitle>
          <CardDescription>
            Review business details and approve or reject new supplier
            registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="border rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {supplier.supplierDetails?.businessName}
                      </h3>
                      <Badge variant="secondary">
                        {supplier.supplierDetails?.businessType}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {supplier.supplierDetails?.contactEmail ||
                          supplier.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {supplier.supplierDetails?.contactPhone ||
                          supplier.contact?.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {supplier.supplierDetails?.city},{" "}
                        {supplier.supplierDetails?.country}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Established {supplier.supplierDetails?.establishedYear}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        {supplier.supplierDetails?.businessDescription}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {supplier.supplierDetails?.specializations?.map(
                          (spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {spec}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveSupplier(supplier.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => initiateRejection(supplier)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {suppliers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No pending applications
                </h3>
                <p>All supplier applications have been processed.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Review Dialog */}
      {selectedSupplier && (
        <Dialog
          open={!!selectedSupplier}
          onOpenChange={() => setSelectedSupplier(null)}
        >
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Supplier Application Review</DialogTitle>
              <DialogDescription>
                Detailed information for{" "}
                {selectedSupplier.supplierDetails?.businessName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4>Business Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">
                        Business Name
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.businessName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Business Type
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.businessType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tax ID</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedSupplier.supplierDetails?.taxId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Established Year
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.establishedYear}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Number of Employees
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.numberOfEmployees}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Website</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.website ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4>Contact Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">
                        Contact Person
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.contactPersonName ||
                          selectedSupplier.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Email Address
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.contactEmail ||
                          selectedSupplier.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Phone Number
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.contactPhone ||
                          selectedSupplier.contact?.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails?.street}{" "}
                        {selectedSupplier.supplierDetails?.building}
                        <br />
                        {selectedSupplier.supplierDetails?.city},{" "}
                        {selectedSupplier.supplierDetails?.country}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Application Date
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedSupplier.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Description */}
              <div>
                <h4>Business Description</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedSupplier.supplierDetails?.businessDescription}
                </p>
              </div>

              {/* Specializations */}
              <div>
                <h4>Specializations</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSupplier.supplierDetails?.specializations?.map(
                    (spec, index) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Licenses */}
              <div>
                <h4>Business License</h4>
                <div className="space-y-2 mt-2">
                  {selectedSupplier.supplierDetails?.licenseType && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedSupplier.supplierDetails.licenseType}{" "}
                        {selectedSupplier.supplierDetails.licenseNumber
                          ? `#${selectedSupplier.supplierDetails.licenseNumber}`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Files (assuming this is what 'licenses' was meant to be if multiple) */}
              {selectedSupplier.supplierDetails?.uploadedFiles?.length ? (
                <div>
                  <h4>Uploaded Documents</h4>
                  <div className="space-y-2 mt-2">
                    {selectedSupplier.supplierDetails.uploadedFiles.map(
                      (file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {file}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedSupplier(null);
                    initiateRejection(selectedSupplier);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApproveSupplier(selectedSupplier.id);
                    setSelectedSupplier(null);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Supplier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Dialog */}
      <AlertDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Supplier Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting{" "}
              {supplierToReject?.supplierDetails?.businessName}
              {"'"}s application. This reason will be communicated to the
              applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectSupplier}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Send Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
