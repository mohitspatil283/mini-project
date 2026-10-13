import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast('Your inquiry has been received. Our team will respond shortly.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact MediGuide Support
        </h1>
        <p className="text-sm text-slate-500">
          Have questions regarding facility listings, data verification, or platform partnership? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Email</h3>
              <p className="text-xs text-slate-500 mt-0.5">support@mediguide.demo.org</p>
              <p className="text-xs text-slate-500">verification@mediguide.demo.org</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Helpdesk Phone</h3>
              <p className="text-xs text-slate-500 mt-0.5">+91 11 4000 8000</p>
              <p className="text-[11px] text-slate-400">Mon - Fri: 09:00 AM - 06:00 PM IST</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Academic Project Office</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Department of Information Technology, B.Tech Mini-Project Lab
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting MediGuide. A confirmation ticket has been logged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Send an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    placeholder="Dr. / Mr. / Ms."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  placeholder="Facility verification, data update, or inquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  placeholder="How can we assist you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
