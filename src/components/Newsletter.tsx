import React from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join Our Newsletter</h2>
        <p className="text-gray-400 text-lg mb-10">
          Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full py-4 px-8 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            required
          />
          <button className="bg-accent text-white px-10 py-4 rounded-full font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
            Subscribe Now
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
