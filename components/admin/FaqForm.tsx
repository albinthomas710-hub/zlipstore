"use client";

import { useState } from "react";
import { FAQ } from "@/lib/db";
import { X, Check } from "@phosphor-icons/react/dist/ssr";

interface FaqFormProps {
  initialData?: FAQ;
  onSave: (faq: FAQ) => void;
  onCancel: () => void;
}

export function FaqForm({ initialData, onSave, onCancel }: FaqFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = initialData ? `/api/admin/faqs/${initialData.id}` : "/api/admin/faqs";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save FAQ");

      const savedFaq = await res.json();
      onSave(savedFaq);
    } catch (error) {
      alert("An error occurred while saving the FAQ.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-border/10 rounded-xl p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Question</label>
          <input
            required
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-border/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g., How long does shipping take?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Answer</label>
          <textarea
            required
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows={5}
            className="w-full bg-zinc-950 border border-border/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter the detailed answer here..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-border/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md font-medium text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : (
              <>
                <Check size={16} weight="bold" />
                Save FAQ
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
