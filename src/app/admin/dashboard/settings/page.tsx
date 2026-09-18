"use client";

import React from "react";
import { Store, Globe, Bell, CreditCard, Shield } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { id: "general", title: "General Info", icon: Store, desc: "Store name, industry, and contact info" },
    { id: "payments", title: "Payments", icon: CreditCard, desc: "Manage payment providers and methods" },
    { id: "notifications", title: "Notifications", icon: Bell, desc: "Manage email and SMS notifications" },
    { id: "security", title: "Security", icon: Shield, desc: "Password, 2FA, and sessions" },
    { id: "localization", title: "Localization", icon: Globe, desc: "Language, currency, and time zone" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Settings</h1>
        <p className="text-charcoal/60 font-light text-sm">Manage your store's configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Nav */}
        <div className="col-span-1 space-y-2">
          {sections.map((sec, i) => (
            <button 
              key={sec.id}
              className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${i === 0 ? 'bg-white shadow-sm border border-charcoal/10' : 'hover:bg-charcoal/5'}`}
            >
              <sec.icon className={`w-5 h-5 mt-0.5 ${i === 0 ? 'text-terracotta' : 'text-charcoal/50'}`} />
              <div>
                <p className="font-medium text-sm">{sec.title}</p>
                <p className="text-xs text-charcoal/50 mt-1">{sec.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 p-6 md:p-8 space-y-8">
            <h2 className="font-serif text-2xl border-b border-charcoal/10 pb-4">General Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Store Name</label>
                  <input 
                    type="text" 
                    defaultValue="Eloria Skincare"
                    className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@eloria.com"
                    className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Store Description</label>
                <textarea 
                  rows={4}
                  defaultValue="Premium botanical skincare formulated for radiant, healthy skin."
                  className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 outline-none focus:border-terracotta transition-colors text-sm resize-none"
                />
              </div>

              <div className="pt-4 border-t border-charcoal/10 flex justify-end">
                <button className="bg-charcoal text-ivory px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-colors shadow-lg">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
