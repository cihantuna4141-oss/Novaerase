"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Props {
  pens: any[];
  onRefresh: () => void;
  onEdit: (pen: any) => void;
}

const ProductsList = ({ pens, onRefresh, onEdit }: Props) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/pens/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted successfully");
      onRefresh();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-6">
            <th className="px-6 py-3">Product Detail</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pens.map((pen) => (
            <tr 
              key={pen.id} 
              className="transition-colors bg-white shadow-sm hover:bg-slate-50 group ring-1 ring-slate-200/50 rounded-2xl"
            >
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden border rounded-xl bg-slate-100 border-slate-200">
                    <Image
                      src={pen.images[0] || "/placeholder.png"}
                      alt=""
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{pen.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono uppercase tracking-tighter">
                      ID: {pen.id.slice(-8)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-100">
                  {pen.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-black text-slate-700">
                GH₵ {pen.basePrice.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </div>
              </td>
              <td className="px-6 py-4 text-right rounded-r-2xl">
                <div className="flex items-center justify-end gap-1">
                  <button 
                    title="View Details"
                    className="p-2 transition-all rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Eye size={17} />
                  </button>
                  <button 
                    onClick={() => onEdit(pen)}
                    title="Edit Product"
                    className="p-2 transition-all rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                  >
                    <Pencil size={17} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pen.id)}
                    title="Delete Product"
                    className="p-2 transition-all rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;