import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Zlip Store",
  description: "Read Zlip Store's Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: September 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              Zlip Store is an online reseller of premium jerseys, clothing, footwear, gadgets, and accessories, 
              based in Nilambur, Kerala, India. We operate through Instagram (<a href="https://instagram.com/zlip_.store.__" target="_blank" rel="noreferrer" className="text-primary hover:underline">@zlip_.store.__</a>) 
              and this website. All orders are processed via WhatsApp DM.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p>When you interact with Zlip Store, we may collect the following:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong className="text-foreground">Contact information</strong> — your name and WhatsApp number when you message us to place an order.</li>
              <li><strong className="text-foreground">Order details</strong> — products you enquire about, sizes, quantities, and delivery address provided during the ordering process.</li>
              <li><strong className="text-foreground">Usage data</strong> — basic analytics such as pages visited, device type, and approximate location (via standard web server logs). We do not use intrusive tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use your information solely to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Process and confirm your orders.</li>
              <li>Communicate updates about your order via WhatsApp.</li>
              <li>Improve our website and product listings.</li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-foreground">not</strong> sell, rent, or share your personal information with any third party for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Storage & Security</h2>
            <p>
              Your personal data shared via WhatsApp is stored only within WhatsApp's secure platform. 
              We do not store payment details as all transactions are handled directly and manually. 
              We take reasonable precautions to protect any data we hold.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies</h2>
            <p>
              This website uses only essential cookies required for basic functionality (such as shopping cart state). 
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of any personal information 
              we hold about you. To exercise these rights, please contact us via WhatsApp at{" "}
              <a href="tel:+919446426981" className="text-primary hover:underline">+91 94464 26981</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page 
              with an updated date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
            <p>
              For any privacy-related questions, reach out to us on WhatsApp:{" "}
              <a href="https://wa.me/919446426981" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                +91 94464 26981
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border/10">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
