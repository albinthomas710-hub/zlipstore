"use client";

import { useState } from "react";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Zlip Store! 👋\n\n*Name:* ${formData.fullName}\n*Contact No:* ${formData.contactNo}\n\n*Message:*\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919633870945?text=${encodedText}`, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="flex-1 w-full bg-background flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-zinc-950 border-b border-border/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white">Contact Us</h1>
          <p className="text-zinc-400 max-w-xl mx-auto md:text-lg">
            Have a question about a drop? Need help with an order? Send us a message directly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">Send a Message</h2>
              <p className="text-muted-foreground text-sm">Fill out the form below and it will open directly in WhatsApp.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-semibold uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-zinc-900 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contactNo" className="text-sm font-semibold uppercase tracking-wider">Contact No</label>
                <input 
                  type="tel" 
                  id="contactNo" 
                  name="contactNo"
                  required
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="Your WhatsApp number"
                  className="w-full px-4 py-3 bg-zinc-900 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-zinc-900 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-500 resize-none"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <WhatsappLogo size={20} weight="fill" />
                Contact on WhatsApp
              </button>
            </form>
          </div>

          {/* Socials & Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tighter uppercase">Connect With Us</h2>
              <div className="grid gap-4">
                <a 
                  href="https://instagram.com/zlip_.store.__" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/10 bg-card hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white group-hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-colors">
                    <InstagramLogo size={24} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-sm tracking-wider">Instagram</h3>
                    <p className="text-muted-foreground text-sm">@zlip_.store.__</p>
                  </div>
                </a>

                <a 
                  href="https://chat.whatsapp.com/GLDxWUv3t5A9Owv6pSwsGC" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/10 bg-card hover:border-[#25D366]/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white group-hover:bg-[#25D366] transition-colors">
                    <WhatsappLogo size={24} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-sm tracking-wider">VIP Drop Group</h3>
                    <p className="text-muted-foreground text-sm">Join our WhatsApp community</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tighter uppercase">Location</h2>
              <div className="p-6 rounded-xl border border-border/10 bg-card">
                <address className="not-italic space-y-2">
                  <p className="font-semibold text-lg text-white">Zlip Store</p>
                  <p className="text-muted-foreground">Nilambur, Kerala</p>
                  <p className="text-muted-foreground">India</p>
                  <p className="text-muted-foreground pt-4 flex flex-col">
                    <span className="text-xs uppercase tracking-wider mb-1">Direct Contact</span>
                    <a href="tel:+919633870945" className="text-primary font-medium hover:underline">+91 96338 70945</a>
                  </p>
                </address>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
