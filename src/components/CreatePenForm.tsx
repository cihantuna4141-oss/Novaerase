"use client";

import React, { useState } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["Fountain", "Ballpoint", "Gel", "Rollerball", "Digital"];

const CreatePenForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  // Handle Image Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    // Add files to FormData manually
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("/api/pens", {
        method: "POST",
        body: formData, // Send as multi-part form data
      });

      const result = await res.json();

      if (result.success) {
        setStatus({ type: "success", msg: "Pen created successfully!" });
        (e.target as HTMLFormElement).reset();
        setFiles([]);
        setPreviews([]);
      } else {
        setStatus({ type: "error", msg: result.error || "Failed to create pen" });
      }
    } catch (error) {
      setStatus({ type: "error", msg: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto bg-white border shadow-sm rounded-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create New Pen</h2>
        <p className="text-gray-500">Add a new luxury writing instrument to the catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Category */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Pen Name</label>
            <input
              name="name"
              required
              placeholder="e.g. Meisterstück Fountain Pen"
              className="w-full px-4 py-2 transition border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              name="category"
              className="w-full px-4 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Base Price ($)</label>
          <input
            name="basePrice"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 3: Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Tell the story behind this pen..."
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 4: Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Product Images</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {previews.map((src, index) => (
              <div key={src} className="relative w-24 h-24 overflow-hidden border rounded-lg group">
                <Image src={src} alt="preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute p-1 text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            <label className="flex flex-col items-center justify-center w-24 h-24 transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-1 font-medium">Upload</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' && <CheckCircle2 size={20} />}
            <span className="text-sm font-medium">{status.msg}</span>
            <p>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreatePenForm;