  // app/supplier-approval/page.tsx
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
  import { Badge } from "@/components/ui/badge";
  import { Textarea } from "@/components/ui/textarea";
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

  // Mock pending supplier applications based on User entity
  const mockPendingSuppliers = [
    {
      _id: "673c1f123456789abcdef010",
      name: "Ethio Auto Parts Distribution",
      email: "contact@ethioautoparts.com",
      role: "supplier",
      status: "pending",
      contact: {
        phone: "+251911555001",
        address: "Piassa, Building #45",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
      businessDetails: {
        businessName: "Ethio Auto Parts Distribution P.L.C",
        businessType: "Distributor",
        taxId: "ET-VAT-123456789",
        establishedYear: 2018,
        employees: "25-50",
        description:
          "We specialize in importing and distributing genuine auto parts across Ethiopia, with a focus on Japanese and German car brands.",
        website: "www.ethioautoparts.com",
        specializations: [
          "Brake Systems",
          "Engine Parts",
          "Electrical Components",
        ],
        licenses: ["Trade License TL-2018-AA-8899", "Import License IL-2019-004"],
      },
      createdAt: "2024-11-18T10:30:00Z",
    },
    {
      _id: "673c1f123456789abcdef011",
      name: "Bole Auto Services",
      email: "info@boleauto.et",
      role: "supplier",
      status: "pending",
      contact: {
        phone: "+251911555002",
        address: "Bole Road, Near Stadium",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
      businessDetails: {
        businessName: "Bole Auto Services & Parts",
        businessType: "Service Center & Parts Dealer",
        taxId: "ET-VAT-987654321",
        establishedYear: 2020,
        employees: "10-25",
        description:
          "Full service auto repair center with extensive parts inventory for Mercedes, BMW, and Toyota vehicles.",
        website: "www.boleauto.et",
        specializations: [
          "Suspension Systems",
          "Air Conditioning",
          "Transmission Parts",
        ],
        licenses: [
          "Service License SL-2020-AA-1234",
          "Parts Dealer License PDL-2020-009",
        ],
      },
      createdAt: "2024-11-17T14:15:00Z",
    },
    {
      _id: "673c1f123456789abcdef012",
      name: "Mercato Spare Parts Hub",
      email: "mercato.parts@gmail.com",
      role: "supplier",
      status: "pending",
      contact: {
        phone: "+251911555003",
        address: "Mercato Area, Shop #67",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
      businessDetails: {
        businessName: "Mercato Spare Parts Hub",
        businessType: "Retailer",
        taxId: "ET-VAT-456789123",
        establishedYear: 2015,
        employees: "5-10",
        description:
          "Traditional spare parts retailer in Mercato with wide variety of aftermarket parts for all vehicle types.",
        website: null,
        specializations: ["Aftermarket Parts", "Used Parts", "Body Parts"],
        licenses: ["Trade License TL-2015-AA-5678"],
      },
      createdAt: "2024-11-16T09:45:00Z",
    },
    {
      _id: "673c1f123456789abcdef013",
      name: "Tekle Motors & Parts",
      email: "teklemotors@yahoo.com",
      role: "supplier",
      status: "pending",
      contact: {
        phone: "+251911555004",
        address: "Gerji Area, Behind Total Station",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
      businessDetails: {
        businessName: "Tekle Motors & Parts P.L.C",
        businessType: "Dealer & Service Center",
        taxId: "ET-VAT-789123456",
        establishedYear: 2012,
        employees: "50-100",
        description:
          "Authorized dealer for multiple brands including Ford, Nissan, and Hyundai with comprehensive parts inventory.",
        website: "www.teklemotors.com.et",
        specializations: ["OEM Parts", "Warranty Parts", "Fleet Services"],
        licenses: [
          "Dealer License DL-2012-AA-001",
          "Import License IL-2013-012",
          "Service License SL-2012-AA-890",
        ],
      },
      createdAt: "2024-11-15T16:20:00Z",
    },
  ];

  export default function Page() {
    const [suppliers, setSuppliers] = useState(mockPendingSuppliers);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionDialog, setShowRejectionDialog] = useState(false);
    const [supplierToReject, setSupplierToReject] = useState(null);

    const handleApproveSupplier = (supplierId: string) => {
      setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
      console.log(`Supplier ${supplierId} approved`);
    };

    const handleRejectSupplier = () => {
      if (!supplierToReject || !rejectionReason.trim()) return;

      setSuppliers(
        suppliers.filter((supplier) => supplier._id !== supplierToReject._id)
      );
      console.log(
        `Supplier ${supplierToReject._id} rejected. Reason: ${rejectionReason}`
      );

      setShowRejectionDialog(false);
      setSupplierToReject(null);
      setRejectionReason("");
    };

    const initiateRejection = (supplier: any) => {
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
                  key={supplier._id}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {supplier.businessDetails.businessName}
                        </h3>
                        <Badge variant="secondary">
                          {supplier.businessDetails.businessType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {supplier.contact.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {supplier.contact.city}, {supplier.contact.country}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Established {supplier.businessDetails.establishedYear}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          {supplier.businessDetails.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {supplier.businessDetails.specializations.map(
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
                        <DialogTrigger>
                          <div
                            onClick={() => setSelectedSupplier(supplier)}
                            className="flex border border-gray-300 rounded-md p-1 items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                            </div>
                        </DialogTrigger>
                      </Dialog>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveSupplier(supplier._id)}
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
                  {selectedSupplier.businessDetails.businessName}
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
                          {selectedSupplier.businessDetails.businessName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Business Type
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.businessDetails.businessType}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tax ID</label>
                        <p className="text-sm text-muted-foreground font-mono">
                          {selectedSupplier.businessDetails.taxId}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Established Year
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.businessDetails.establishedYear}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Number of Employees
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.businessDetails.employees}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Website</label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.businessDetails.website ||
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
                          {selectedSupplier.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Email Address
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Phone Number
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.contact.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.contact.address}
                          <br />
                          {selectedSupplier.contact.city},{" "}
                          {selectedSupplier.contact.country}
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
                    {selectedSupplier.businessDetails.description}
                  </p>
                </div>

                {/* Specializations */}
                <div>
                  <h4>Specializations</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSupplier.businessDetails.specializations.map(
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
                  <h4>Business Licenses</h4>
                  <div className="space-y-2 mt-2">
                    {selectedSupplier.businessDetails.licenses.map(
                      (license, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {license}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

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
                      handleApproveSupplier(selectedSupplier._id);
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
                {supplierToReject?.businessDetails.businessName}'s application.
                This reason will be communicated to the applicant.
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
