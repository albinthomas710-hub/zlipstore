"use client";

import { FAQ } from "@/lib/db";
import { PencilSimple, Trash, CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export function FaqList({
  faqs,
  onEdit,
  onDelete,
  onReorder
}: {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onReorder: (newFaqs: FAQ[]) => void;
}) {
  const [isReordering, setIsReordering] = useState(false);

  const moveFaq = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === faqs.length - 1)
    ) return;

    setIsReordering(true);
    
    const newFaqs = [...faqs];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;
    
    // Re-assign sortOrder
    const updatedFaqs = newFaqs.map((faq, i) => ({
      ...faq,
      sortOrder: i + 1
    }));
    
    try {
      const res = await fetch("/api/admin/faqs/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFaqs.map(f => ({ id: f.id, sortOrder: f.sortOrder }))),
      });
      
      if (res.ok) {
        onReorder(updatedFaqs);
      } else {
        alert("Failed to reorder FAQs.");
      }
    } catch (e) {
      alert("Error reordering FAQs.");
    } finally {
      setIsReordering(false);
    }
  };

  if (faqs.length === 0) {
    return (
      <div className="bg-zinc-900 border border-border/10 rounded-xl p-12 text-center">
        <p className="text-zinc-400 mb-4">No FAQs added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-border/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-border/10">
            <tr>
              <th className="px-4 sm:px-6 py-4 font-medium w-16">Order</th>
              <th className="px-4 sm:px-6 py-4 font-medium">Question</th>
              <th className="px-4 sm:px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {faqs.map((faq, index) => (
              <tr key={faq.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col items-center gap-1 w-6">
                    <button 
                      onClick={() => moveFaq(index, "up")} 
                      disabled={index === 0 || isReordering}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <CaretUp size={16} weight="bold" />
                    </button>
                    <span className="text-xs font-mono text-zinc-500">{index + 1}</span>
                    <button 
                      onClick={() => moveFaq(index, "down")} 
                      disabled={index === faqs.length - 1 || isReordering}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <CaretDown size={16} weight="bold" />
                    </button>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <p className="font-medium text-white mb-1">{faq.question}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2 max-w-xl">{faq.answer}</p>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(faq)}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <PencilSimple size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(faq.id)}
                      className="text-red-500/70 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
