import { Metadata } from "next";
import { db } from "@/lib/db";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Question } from "@phosphor-icons/react/dist/ssr";

const BASE_URL = "https://zlipstore.in";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently Asked Questions about Zlip Store. Shipping, payments, quality, and more.",
  openGraph: {
    title: "FAQ | Zlip Store",
    description: "Frequently Asked Questions about Zlip Store. Shipping, payments, quality, and more.",
    url: `${BASE_URL}/faq`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },
};

export default async function FAQPage() {
  const faqs = await db.getFAQs();

  // Generate FAQPage Schema markup for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="w-full bg-zinc-950 border-b border-border/10 py-16 md:py-24 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-[100%] blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 text-primary">
            <Question size={32} weight="fill" />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Help Center</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Everything you need to know about the product and billing. Can't find the answer you're looking for? Reach out on WhatsApp.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {faqs.length > 0 ? (
          <FaqAccordion faqs={faqs} />
        ) : (
          <div className="text-center text-zinc-500 py-12">
            <p>No FAQs available at the moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}
