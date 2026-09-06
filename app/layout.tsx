import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://zlipstore.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Zlip Store — Premium Jerseys & Streetwear | Nilambur, Kerala",
    template: "%s | Zlip Store",
  },
  description:
    "Shop premium jerseys, streetwear, gadgets and accessories at affordable prices. Real Madrid, Barcelona, PSG jerseys & more. All India delivery. WhatsApp to order.",
  keywords: [
    "football jersey",
    "buy jersey online india",
    "football jersey kerala",
    "nilambur jersey shop",
    "real madrid jersey",
    "barcelona jersey",
    "psg jersey",
    "mbappe jersey",
    "zlip store",
    "streetwear india",
    "affordable jerseys india",
    "premium jersey online",
    "football kit india",
    "jersey shop kerala",
    "buy football jersey whatsapp",
  ],
  authors: [{ name: "Zlip Store", url: BASE_URL }],
  creator: "Zlip Store",
  publisher: "Zlip Store",
  category: "Shopping",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Zlip Store",
    title: "Zlip Store — Premium Jerseys & Streetwear",
    description:
      "Shop premium jerseys and streetwear at affordable prices. All India delivery. WhatsApp to order instantly.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zlip Store — Premium Jerseys & Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zlip Store — Premium Jerseys & Streetwear",
    description:
      "Shop premium jerseys and streetwear at affordable prices. All India delivery. WhatsApp to order instantly.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zlip Store",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.jpg`,
  description:
    "Premium jerseys, streetwear, and accessories at affordable prices. All India delivery.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nilambur",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9633870945",
    contactType: "customer service",
    availableLanguage: ["English", "Malayalam"],
  },
  sameAs: [
    "https://instagram.com/zlip_.store.__",
    "https://wa.me/919633870945",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zlip Store",
  url: BASE_URL,
  description: "Premium jerseys and streetwear at affordable prices.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
