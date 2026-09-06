"use client";

import { useState } from "react";
import { FAQ } from "@/lib/db";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              isOpen ? "border-primary/50 bg-zinc-900/80 shadow-[0_0_15px_rgba(202,255,0,0.05)]" : "border-border/10 bg-zinc-950 hover:border-border/30"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
            >
              <h3 className={`font-semibold md:text-lg transition-colors ${isOpen ? "text-primary" : "text-white"}`}>
                {faq.question}
              </h3>
              <div 
                className={`flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isOpen ? "bg-primary/10 text-primary rotate-180" : "bg-zinc-900 text-zinc-400"
                }`}
              >
                <CaretDown size={16} weight="bold" />
              </div>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-5 md:p-6 pt-0 text-zinc-400 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
