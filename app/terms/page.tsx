import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Zlip Store",
  description: "Read Zlip Store's Terms of Service to understand the rules and conditions of using our website and placing orders.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: September 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. About Zlip Store</h2>
            <p>
              Zlip Store ("<strong className="text-foreground">we</strong>", "<strong className="text-foreground">us</strong>", or "<strong className="text-foreground">our</strong>") is a product reseller 
              based in Nilambur, Kerala, India, operating through this website and Instagram. By using our website 
              or placing an order with us, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Order Process</h2>
            <p>
              All orders are handled manually via WhatsApp. Placing an item in your cart and submitting a WhatsApp 
              message is a <strong className="text-foreground">purchase request</strong>, not a confirmed order. 
              A sale is only confirmed once our team acknowledges availability and you confirm payment details directly with us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Pricing</h2>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Prices displayed on the website are in Indian Rupees (₹) and are inclusive of product cost only.</li>
              <li>Delivery charges are additional and will be confirmed at the time of order.</li>
              <li>For products marked "Enquire Price", pricing is determined on request and may vary.</li>
              <li>We reserve the right to update prices at any time without prior notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Product Availability</h2>
            <p>
              We are a reseller and our inventory fluctuates. Products displayed as "In Stock" are subject to 
              real-time availability. In the rare event a product is unavailable after you have placed a request, 
              we will notify you promptly via WhatsApp and offer a full refund or an alternative.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Payments</h2>
            <p>
              Payment instructions are shared privately via WhatsApp. We currently do not process payments through 
              this website. Please do not transfer money to any account that has not been verified directly with 
              our official WhatsApp number:{" "}
              <a href="tel:+919633870945" className="text-primary hover:underline">+91 96338 70945</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Shipping & Delivery</h2>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>We ship across India. Delivery timelines will be communicated after order confirmation.</li>
              <li>Delivery charges vary by location and will be confirmed before payment.</li>
              <li>We are not responsible for delays caused by courier partners or unforeseen events.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Returns & Exchanges</h2>
            <p>
              Due to the nature of our reselling model, we handle returns and exchanges on a case-by-case basis. 
              If you receive a wrong or damaged item, please contact us within <strong className="text-foreground">48 hours</strong> of 
              delivery via WhatsApp with photos. We will do our best to resolve the issue fairly.
            </p>
            <p className="mt-3">
              We currently do not accept returns for change-of-mind purchases. Please check sizes carefully before confirming your order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Intellectual Property</h2>
            <p>
              All content on this website, including images, logos, and text, belongs to Zlip Store or its 
              respective owners. You may not reproduce, copy, or distribute any content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Zlip Store shall not be liable for any indirect, 
              incidental, or consequential damages arising from the use of this website or from any products 
              purchased through us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction 
              of courts in Kerala, India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              For any questions about these Terms, contact us on WhatsApp:{" "}
              <a href="https://wa.me/919633870945" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                +91 96338 70945
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
