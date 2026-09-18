"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, CheckCircle2, ChevronDown } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee. If you are not completely satisfied with your Eloria product, simply return it within 30 days of purchase for a full refund." },
    { q: "Are your products cruelty-free?", a: "Yes, 100%. We never test on animals, and all our formulations are vegan and certified cruelty-free." },
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Expedited shipping is available at checkout and typically arrives within 1-2 business days." },
    { q: "Do you ship internationally?", a: "Currently, we ship to the US, Canada, UK, and Australia. We are working on expanding our international shipping soon." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { publicApi } = await import('@/lib/api');
      await publicApi.submitContact(formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Failed to send message. Please try again.');
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow">
        <PageHero 
          titleStart="Get in"
          titleHighlight="Touch"
          description="We are here to assist you with personalized skincare advice, order inquiries, and any questions you may have about Eloria."
          backgroundImage="/ContactHero.jfif"
          align="center"
          overlayOpacity={0.45}
          height="sm"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" }
          ]}
          imageClassName="object-cover object-[center_10%]"
          fixedBackground={true}
        />
        
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
            
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl mb-8">Let's Connect</h2>
              <p className="text-charcoal/70 font-light leading-relaxed mb-12">
                Whether you have a question about our formulations, need help building a routine, or have an inquiry about your order, our concierges are ready to assist.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f4efe6] rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-[0.2em] text-[11px] font-medium mb-1">Our Studio</h3>
                    <p className="text-charcoal/60 font-light text-sm">450 Skincare Ave, Suite 200<br/>New York, NY 10012</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f4efe6] rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-[0.2em] text-[11px] font-medium mb-1">Email Us</h3>
                    <p className="text-charcoal/60 font-light text-sm">concierge@eloriaskincare.com<br/>wholesale@eloriaskincare.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f4efe6] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-[0.2em] text-[11px] font-medium mb-1">Call Us</h3>
                    <p className="text-charcoal/60 font-light text-sm">+1 (800) 123-4567<br/>Mon-Fri, 9am - 5pm EST</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-64 bg-[#f4efe6] rounded-2xl overflow-hidden relative group cursor-pointer border border-charcoal/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-ivory/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-medium text-charcoal shadow-sm">
                     View on Google Maps
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-charcoal/5 relative overflow-hidden">
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center px-10"
                    >
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl mb-2">Message Sent</h3>
                      <p className="text-charcoal/60 font-light text-sm">Thank you for reaching out. A member of our concierge team will get back to you within 24 hours.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="font-serif text-2xl mb-8">Send a Message</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal/60 mb-2">Name</label>
                      <input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        type="text" 
                        className="border-b border-charcoal/20 bg-transparent py-2 outline-none focus:border-terracotta transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal/60 mb-2">Email</label>
                      <input 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        type="email" 
                        className="border-b border-charcoal/20 bg-transparent py-2 outline-none focus:border-terracotta transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal/60 mb-2">Subject</label>
                    <input 
                      required 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      type="text" 
                      className="border-b border-charcoal/20 bg-transparent py-2 outline-none focus:border-terracotta transition-colors"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal/60 mb-2">Message</label>
                    <textarea 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={5} 
                      className="border-b border-charcoal/20 bg-transparent py-2 outline-none focus:border-terracotta transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="mt-6 bg-charcoal text-ivory py-4 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-terracotta transition-colors disabled:opacity-70 flex items-center justify-center h-14"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full"
                      />
                    ) : "Send Message"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto pt-16 border-t border-charcoal/10">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-charcoal/10 rounded-xl overflow-hidden bg-white/50">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white transition-colors"
                  >
                    <span className="font-serif text-lg">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-charcoal/50 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-charcoal/60 font-light text-sm leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
