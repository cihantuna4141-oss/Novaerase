"use client";

import React, { useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Eraser,
  DollarSign,
  AlignLeft,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const CATEGORIES = ["Fountain", "Ballpoint", "Gel", "Rollerball", "Digital"];

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const CreatePenForm = ({ onSuccess, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [
        ...prev,
        ...selectedFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch("/api/pens", { method: "POST", body: formData });
      const result = await res.json();

      if (result.success) {
        toast.success("Archive Updated", {
          description: "The new instrument has been curated successfully.",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (err) {
      toast.error("Network synchronization error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* SECTION 1: IDENTITY */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Instrument Name
          </label>
          <div className="relative">
            <Eraser className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 w-4 h-4" />
            <input
              name="name"
              required
              placeholder="e.g. Classic Gold Edition"
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink/20 text-sm font-medium"
            />
          </div>
        </div>
        {/* Row 2: Price & Description */}
        <div className="space-y-2 md:col-span-1">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Price ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 w-4 h-4" />
            <input
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Brief Narrative
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-gold/40 w-4 h-4" />
            <textarea
              name="description"
              rows={1}
              placeholder="Describe the aesthetic and feel..."
              className="w-full  px-4 py-3 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm font-medium resize-none"
            />
          </div>
        </div>
        {/* SECTION 2: VISUALS */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Upload Image
          </label>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((src, index) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden border-2 border-gold/30 rounded-xl group bg-white shadow-sm"
              >
                <Image
                  src={src}
                  alt="preview"
                  fill
                  className="object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute p-1.5 text-white transition-all bg-ink/80 backdrop-blur-md rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <label className="flex flex-col items-center justify-center aspect-square transition-all border-2 border-gold/30 border-dashed rounded-xl cursor-pointer hover:border-gold hover:bg-gold/5 group">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-5 h-5 text-gold/40 group-hover:text-gold transition-colors" />
                <span className="text-[9px] text-gold/40 group-hover:text-gold font-bold uppercase tracking-widest">
                  Add Image
                </span>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* FOOTER: ACTIONS */}
        <div className="flex  gap-3 pt-6 border-t border-gold/5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-[11px] font-bold tracking-[0.2em] text-ink uppercase bg-white border border-gold/20 rounded-xl hover:bg-cream transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-3 py-4 text-[11px] font-bold tracking-[0.2em] text-cream uppercase bg-ink rounded-xl hover:bg-gold transition-all duration-500 disabled:bg-ink/40 shadow-xl shadow-gold/5"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Synchronizing...
              </>
            ) : (
              <>Curate Entry</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePenForm;
