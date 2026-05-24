"use client";

import React, { useState, useEffect } from "react";
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

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  initialData?: any; 
}

const CreatePenForm = ({ onSuccess, onClose, initialData }: Props) => {
  const [loading, setLoading] = useState(false);

  // Track existing images from the database
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Track new files being uploaded
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const isEditing = !!initialData;

  // Initialize form if editing
  useEffect(() => {
    if (initialData) {
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...selectedFiles]);
      setNewPreviews((prev) => [
        ...prev,
        ...selectedFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);

    const formData = new FormData(formElement);

    // 1. Append new files
    newFiles.forEach((f) => formData.append("images", f));

    // 2. Append existing images that were NOT deleted
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const url = isEditing ? `/api/pens/${initialData.id}` : "/api/pens";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        toast.success(isEditing ? "Entry Updated" : "Product Created", {
          description: isEditing
            ? "The product record has been modified."
            : "The new instrument has been curated successfully.",
        });

        // Reset
        formElement.reset();
        newPreviews.forEach((url) => URL.revokeObjectURL(url));
        setNewFiles([]);
        setNewPreviews([]);
        setExistingImages([]);

        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (err) {
      toast.error("Network synchronization error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Instrument Name
          </label>
          <div className="relative">
            <Eraser className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 w-4 h-4" />
            <input
              name="name"
              required
              defaultValue={initialData?.name || ""}
              placeholder="e.g. Classic Gold Edition"
              className="w-full pl-11 pr-4 py-2 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all text-base font-medium"
            />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
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
              defaultValue={initialData?.price || ""}
              placeholder="0.00"
              className="w-full pl-11 pr-4 py-2 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all text-base font-medium"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Brief Narrative
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-gold/40 w-4 h-4" />
            <textarea
              name="description"
              rows={3}
              defaultValue={initialData?.description || ""}
              placeholder="Describe the product..."
              className="w-full pl-11 pr-4 py-2 bg-white border-2 border-gold/30 rounded-lg outline-none focus:ring-2 focus:ring-gold/20 transition-all text-base font-medium resize-none"
            />
          </div>
        </div>

        {/* Visuals */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">
            Upload Images {isEditing && "(New & Existing)"}
          </label>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center transition-all border-2 border-gold/30 border-dashed rounded-xl cursor-pointer hover:border-gold hover:bg-gold/5 group">
              <div className="flex flex-col h-20 w-20 justify-center items-center space-y-1">
                <Upload className="w-4 h-4 text-gold/40 group-hover:text-gold" />
                <span className="text-[8px] text-gold font-bold uppercase text-center">
                  Add More
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

            {/* Existing Images (From DB) */}
            {existingImages.map((url, index) => (
              <div
                key={url}
                className="relative h-20 w-20 overflow-hidden border-2 border-gold/60 rounded-lg bg-cream shadow-sm"
              >
                <Image
                  src={url}
                  alt="existing"
                  fill
                  className="object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute p-1 text-white bg-ink/80 rounded-full top-1 right-1 hover:bg-red-500"
                >
                  <X size={10} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gold/80 text-[7px] text-white text-center font-bold">
                  SAVED
                </div>
              </div>
            ))}

            {/* New Previews (To be uploaded) */}
            {newPreviews.map((src, index) => (
              <div
                key={src}
                className="relative h-20 w-20 overflow-hidden border-2 border-gold/30 border-dashed rounded-lg bg-white shadow-sm animate-pulse"
              >
                <Image
                  src={src}
                  alt="preview"
                  fill
                  className="object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute p-1 text-white bg-ink/80 rounded-full top-1 right-1 hover:bg-red-500"
                >
                  <X size={10} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-ink/80 text-[7px] text-white text-center font-bold">
                  NEW
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gold/5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-[11px] font-bold text-ink uppercase bg-white border border-gold/20 rounded-lg hover:bg-cream transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-3 py-2.5 text-[11px] font-bold text-cream uppercase bg-ink rounded-lg hover:bg-gold transition-all disabled:bg-ink/40"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>{isEditing ? "Update Product" : "Create Entry"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePenForm;
