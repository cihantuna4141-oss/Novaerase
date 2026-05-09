"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, MoreVertical, Layers } from "lucide-react";
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
    <div className="w-full">
      {/* --- MOBILE VIEW: CARD LAYOUT (Visible on < 1024px) --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {pens.map((pen) => (
          <div 
            key={pen.id} 
            className="bg-white p-4 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-start gap-4"
          >
            {/* Image Section */}
            <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden border bg-slate-50 rounded-2xl border-slate-100">
              <Image
                src={pen.images[0] || "/placeholder.png"}
                alt=""
                fill
                className="object-contain p-2"
              />
            </div>

            {/* Content Section */}
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black truncate text-slate-900">{pen.name}</h4>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100">
                    {pen.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  LIVE
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm font-black text-slate-700">
                  GH₵ {pen.basePrice.toFixed(2)}
                </div>
                
                {/* Mobile Actions */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => onEdit(pen)}
                    className="p-2 transition-transform text-slate-400 bg-slate-50 rounded-xl active:scale-90"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pen.id)}
                    className="p-2 text-red-400 transition-transform bg-red-50 rounded-xl active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW: TABLE LAYOUT (Visible on >= 1024px) --- */}
      <div className="hidden lg:block bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-5">Product Detail</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pens.map((pen) => (
              <tr key={pen.id} className="transition-colors hover:bg-slate-50/50 group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden border rounded-xl bg-slate-100 border-slate-200">
                      <Image src={pen.images[0] || "/placeholder.png"} alt="" fill className="object-contain p-1.5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{pen.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {pen.id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-100">
                    {pen.category}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm font-black text-slate-700">GH₵ {pen.basePrice.toFixed(2)}</td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(pen)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><Pencil size={17} /></button>
                    <button onClick={() => handleDelete(pen.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pens.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-50">
            <Layers className="text-slate-200" size={32} />
          </div>
          <p className="text-sm font-bold tracking-widest uppercase text-slate-400">No Inventory Found</p>
        </div>
      )}
    </div>
  );
}

export default ProductsList;