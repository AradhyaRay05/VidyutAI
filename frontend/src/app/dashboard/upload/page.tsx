"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const APPLIANCES = [
  "Air Conditioner", "Refrigerator", "Lighting", "Television",
  "Washing Machine", "Computer", "Fan", "Microwave", "Water Heater", "Other",
];

const APPLIANCE_USAGE = [
  { name: "AC (1 ton)", kwh: "1.0-1.5/hr" },
  { name: "Refrigerator", kwh: "1.5-2.0/day" },
  { name: "LED Bulb", kwh: "0.01/hr" },
  { name: "Washing Machine", kwh: "0.5-2.0/cycle" },
  { name: "Television", kwh: "0.08-0.15/hr" },
  { name: "Computer", kwh: "0.1-0.4/hr" },
  { name: "Fan", kwh: "0.03-0.075/hr" },
];

export default function UploadPage() {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");

  const [manualAppliance, setManualAppliance] = useState("");
  const [manualKwh, setManualKwh] = useState("");
  const [manualHours, setManualHours] = useState("1.0");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.[0]) {
      setSelectedFile(fileInputRef.current.files[0].name);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const res = await fetch(API_BASE + "/api/data/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      setResult({ imported: data.imported, skipped: data.skipped });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleManualAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualAppliance || !manualKwh) return;

    setManualLoading(true);
    setManualSuccess(false);

    try {
      const res = await fetch(API_BASE + "/api/data/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          appliance_name: manualAppliance,
          power_usage_kwh: parseFloat(manualKwh),
          duration_hours: parseFloat(manualHours) || 1.0,
        }),
      });
      if (!res.ok) throw new Error("Failed to add record");
      setManualSuccess(true);
      setManualAppliance("");
      setManualKwh("");
      setManualHours("1.0");
      setTimeout(() => setManualSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add record");
    } finally {
      setManualLoading(false);
    }
  };

  const downloadSample = async () => {
    const csv = [
      "appliance_name,power_usage_kwh,timestamp,duration_hours",
      "Air Conditioner,3.5,2025-06-01 14:00:00,4.0",
      "Refrigerator,1.8,2025-06-01 00:00:00,24.0",
      "Lighting,0.5,2025-06-01 18:00:00,6.0",
      "Television,0.3,2025-06-01 20:00:00,3.0",
      "Washing Machine,2.0,2025-06-02 10:00:00,1.5",
      "Computer,0.4,2025-06-02 09:00:00,8.0",
      "Fan,0.2,2025-06-02 22:00:00,8.0",
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_energy_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            Upload Data
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your electricity usage data for AI analysis
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                CSV Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadSample} type="button">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
                <Badge variant="default" className="text-[10px]">CSV format</Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Required: <code className="bg-muted px-1 rounded">appliance_name</code>, <code className="bg-muted px-1 rounded">power_usage_kwh</code></p>
                <p>Optional: <code className="bg-muted px-1 rounded">timestamp</code>, <code className="bg-muted px-1 rounded">duration_hours</code></p>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Click to select CSV file</p>
                  <p className="text-xs text-muted-foreground">or drag and drop</p>
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                </div>

                {selectedFile && (
                  <p className="text-sm text-muted-foreground">Selected: {selectedFile}</p>
                )}

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? "Uploading..." : "Upload CSV"}
                </Button>
              </form>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-semibold text-success">Upload Successful</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.imported} records imported{result.skipped > 0 ? ", " + result.skipped + " rows skipped" : ""}
                  </p>
                </motion.div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Plus className="h-5 w-5 text-primary" />
                Manual Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>Appliance</label>
                  <select
                    value={manualAppliance}
                    onChange={(e) => setManualAppliance(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select appliance...</option>
                    {APPLIANCES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>Energy (kWh)</label>
                    <input type="number" value={manualKwh} onChange={(e) => setManualKwh(e.target.value)} placeholder="3.5" step="0.1" min="0.1" required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>Hours</label>
                    <input type="number" value={manualHours} onChange={(e) => setManualHours(e.target.value)} placeholder="1.0" step="0.5" min="0.5" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={manualLoading}>
                  {manualLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Record
                </Button>

                {manualSuccess && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm text-success flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Record added successfully
                  </motion.div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-nav)" }}>
                  Common Appliance Usage
                </h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {APPLIANCE_USAGE.map((item) => (
                    <div key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.kwh}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
