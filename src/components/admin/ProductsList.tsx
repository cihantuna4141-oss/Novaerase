"use client";

import Image from "next/image";
import { Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

interface Props {
  pens: any[];
  onRefresh: () => void;
  onEdit: (pen: any) => void;
}

const ProductsList = ({ pens, onRefresh, onEdit }: Props) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this archival entry?"))
      return;
    const res = await fetch(`/api/pens/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Products updated successfully");
      onRefresh();
    }
  };

  return (
    <div className="w-full">
      {/* MOBILE CARD VIEW */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {pens.map((pen) => (
          <div
            key={pen.id}
            className="bg-white p-5 rounded-lg border border-gold/10 shadow-sm flex items-start gap-5"
          >
            <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden border bg-cream rounded-2xl border-gold/10">
              <Image
                src={pen.images[0] || "/placeholder.png"}
                alt=""
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg text-ink leading-tight">
                    {pen.name}
                  </h4>
                  <div className="text-[9px] text-gold font-mono tracking-widest uppercase mt-1 opacity-50">
                    Ref: {pen.id.slice(-6)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5">
                <div className="text-sm font-bold text-ink">
                  $ {pen.price.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(pen)}
                    className="p-3 text-ink/40 bg-cream rounded-xl hover:text-ink"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pen.id)}
                    className="p-3 text-red-400 bg-red-50 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-lg border border-gold/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] border-b border-gold/5 bg-cream/20">
              <th className="px-10 py-6">Products Detail</th>
              <th className="px-10 py-6">Price</th>
              <th className="px-10 py-6">Description</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {pens.map((pen) => (
              <tr
                key={pen.id}
                className="transition-colors hover:bg-cream/20 group"
              >
                <td className="px-10 py-5">
                  <div className="flex items-center gap-5">
                    <div className="relative w-14 h-14 overflow-hidden border rounded-lg bg-cream border-gold/10">
                      <Image
                        src={pen.images[0] || "/placeholder.png"}
                        alt=""
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <div className="font-serif text-lg text-ink">
                        {pen.name}
                      </div>
                      <div className="text-[9px] text-gold font-mono tracking-widest uppercase mt-1 opacity-50">
                        Ref: {pen.id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-5 font-bold text-ink">
                  $ {pen.price.toFixed(2)}
                </td>
                <td className="px-10 py-5">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-gold uppercase tracking-widest">
                    {pen.description}
                  </div>
                </td>
                <td className="px-10 py-5 text-right">
                  <div className="flex justify-end gap-1 transition-all duration-300">
                    <button
                      onClick={() => onEdit(pen)}
                      className="p-3 rounded-xl text-ink/30 hover:text-ink hover:bg-cream transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(pen.id)}
                      className="p-3 rounded-xl text-ink/30 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pens.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
          <Layers className="text-gold mb-6" size={48} strokeWidth={1} />
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-gold">
            Products Empty
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
