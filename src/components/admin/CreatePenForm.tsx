"use client";
import React, { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreatePenForm({ onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviews(prev => [...prev, ...selectedFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    files.forEach(f => formData.append("images", f));

    try {
      const res = await fetch("/api/pens", { method: "POST", body: formData });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Pen Added Successfully");
        onSuccess(); // Refresh the list
        onClose();   // Close the modal
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-black text-gray-400 uppercase">Pen Name</label>
            <input name="name" required className="w-full p-3 font-medium border outline-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-black text-gray-400 uppercase">Category</label>
            <select name="category" className="w-full p-3 font-medium border outline-none bg-gray-50 rounded-xl">
              <option>Fountain</option>
              <option>Ballpoint</option>
              <option>Rollerball</option>
              <option>Gel</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-xs font-black text-gray-400 uppercase">Price (GH₵)</label>
            <input name="basePrice" type="number" step="0.01" required className="w-full p-3 font-medium border outline-none bg-gray-50 rounded-xl" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block mb-1 text-xs font-black text-gray-400 uppercase">Product Images</label>
          <div className="flex flex-wrap gap-2 min-h-[100px] p-2 border-2 border-dashed rounded-2xl items-center justify-center">
            {previews.map((p, i) => (
              <div key={i} className="relative w-16 h-16 overflow-hidden border shadow-sm rounded-xl">
                <Image src={p} alt="" fill className="object-cover" />
              </div>
            ))}
            <label className="flex items-center justify-center w-16 h-16 text-blue-600 transition cursor-pointer rounded-xl bg-blue-50 hover:bg-blue-100">
              <Upload size={20} />
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <div>
            <label className="block mb-1 text-xs font-black text-gray-400 uppercase">Description</label>
            <textarea name="description" className="w-full p-3 text-sm border outline-none bg-gray-50 rounded-xl" rows={3} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button 
          type="button" 
          onClick={onClose} 
          className="flex-1 px-6 py-4 font-bold text-gray-500 transition rounded-2xl hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          disabled={loading} 
          className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition disabled:bg-gray-300 shadow-xl shadow-gray-200"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Pen Product"}
        </button>
      </div>
    </form>
  );
}