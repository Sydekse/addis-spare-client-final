"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  Image as TImage,
  Table as TableIcon,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  chartsRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLDivElement>;
  reportData: {
    columns: string[];
    data: Record<string, unknown>[];
    keyMapping: Record<string, string>;
  };
  reportMeta: {
    name: string;
    type: string;
    dateRange: string;
    generatedAt: string;
  };
}

export function ExportModal({
  isOpen,
  onClose,
  reportType,
  chartsRef,
  tableRef,
  reportData,
  reportMeta,
}: ExportModalProps) {
  // Reference props that may be unused depending on export options to satisfy linter
  console.debug("ExportModal props:", {
    reportType,
    hasChartsRef: !!chartsRef,
    hasTableRef: !!tableRef,
  });
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTable, setIncludeTable] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [fileName, setFileName] = useState(
    `${reportMeta.name}_${new Date().toISOString().split("T")[0]}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // CSV Export Function
  const exportToCSV = async () => {
    try {
      setExportProgress(20);
      const { columns, data, keyMapping } = reportData;

      const csvHeader = columns.join(",");
      const csvRows = data.map((row) =>
        columns
          .map((col) => {
            const value = (row as Record<string, unknown>)[keyMapping[col]];
            const strValue = String(value ?? "");
            return strValue.includes(",")
              ? `"${strValue.replace(/"/g, '""')}"`
              : strValue;
          })
          .join(",")
      );

      setExportProgress(60);

      let csvContent = csvHeader + "\n" + csvRows.join("\n");

      if (includeMetadata) {
        const metadata = [
          `Report: ${reportMeta.name}`,
          `Type: ${reportMeta.type}`,
          `Date Range: ${reportMeta.dateRange}`,
          `Generated: ${new Date(reportMeta.generatedAt).toLocaleString()}`,
          `Total Records: ${data.length}`,
          "",
          "",
        ].join("\n");
        csvContent = metadata + "\n" + csvContent;
      }

      setExportProgress(80);

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setExportProgress(100);
      setExportStatus("success");
      toast.success("CSV export completed successfully!");
    } catch (error) {
      console.error("CSV export failed:", error);
      setExportStatus("error");
      toast.error("Failed to export CSV. Please try again.");
    }
  };

  // PDF Export Function (using html-to-image instead of html2canvas)
  // PDF Export Function (using html-to-image instead of html2canvas)
  // PDF Export Function (capture entire wrapper by id)
  const exportToPDF = async () => {
    try {
      setExportProgress(10);

      const jsPDF = (await import("jspdf")).default;
      const { toPng } = await import("html-to-image");

      setExportProgress(20);

      const wrapper = document.getElementById("main-report");
      if (!wrapper) {
        throw new Error("Report wrapper (#main-report) not found.");
      }

      // Convert wrapper to image
      const dataUrl = await toPng(wrapper, { cacheBust: true });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Scale image to fit within A4 page
      const { width, height } = wrapper.getBoundingClientRect();
      const imgWidth = pageWidth - 20;
      const imgHeight = (height * imgWidth) / width;

      pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);

      setExportProgress(90);
      pdf.save(`${fileName}.pdf`);
      setExportProgress(100);
      setExportStatus("success");
      toast.success("PDF export completed successfully!");
    } catch (error) {
      console.error("PDF export failed:", error);
      setExportStatus("error");
      toast.error("Failed to export PDF. Please try again.");
    }
  };

  const handleExport = async () => {
    if (!includeCharts && !includeTable) {
      toast.error("Please select at least one content type to export.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportStatus("idle");

    try {
      if (exportFormat === "csv") {
        await exportToCSV();
      } else {
        await exportToPDF();
      }
    } catch {
      setExportStatus("error");
    }

    const statusAtExport = exportStatus;
    setTimeout(() => {
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus("idle");
      if (statusAtExport === "success") {
        onClose();
      }
    }, 3000);
  };

  const resetModal = () => {
    setExportFormat("csv");
    setIncludeCharts(true);
    setIncludeTable(true);
    setIncludeMetadata(true);
    setIsExporting(false);
    setExportProgress(0);
    setExportStatus("idle");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Export your {reportMeta.name.toLowerCase()} with customizable
            options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <Select
              value={exportFormat}
              onValueChange={(value: "csv" | "pdf") => setExportFormat(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV File (.csv)
                </SelectItem>
                <SelectItem value="pdf">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Document (.pdf)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Include Content</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={(val) => setIncludeCharts(val === true)}
                  disabled={exportFormat === "csv"}
                />
                <Label
                  htmlFor="charts"
                  className="flex items-center gap-2 text-sm"
                >
                  <TImage className="h-4 w-4" />
                  Charts & Visualizations
                  {exportFormat === "csv" && (
                    <Badge variant="secondary" className="text-xs">
                      PDF Only
                    </Badge>
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="table"
                  checked={includeTable}
                  onCheckedChange={(val) => setIncludeTable(val === true)}
                />
                <Label
                  htmlFor="table"
                  className="flex items-center gap-2 text-sm"
                >
                  <TableIcon className="h-4 w-4" />
                  Data Table ({reportData.data.length} records)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={(val) => setIncludeMetadata(val === true)}
                />
                <Label
                  htmlFor="metadata"
                  className="flex items-center gap-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Report Metadata
                </Label>
              </div>
            </div>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="filename" className="text-sm font-medium">
              File Name
            </Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name..."
            />
          </div>

          {/* Progress */}
          {isExporting && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {exportStatus === "success" && (
                      <CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />
                    )}
                    {exportStatus === "error" && (
                      <AlertCircle className="inline h-4 w-4 text-red-600 mr-2" />
                    )}
                    {exportStatus === "idle" && "Exporting..."}
                    {exportStatus === "success" && "Export completed!"}
                    {exportStatus === "error" && "Export failed!"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {exportProgress}%
                  </span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 gap-2"
              disabled={isExporting || (!includeCharts && !includeTable)}
            >
              <Download className="h-4 w-4" />
              {isExporting
                ? "Exporting..."
                : `Export ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
