import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Facebook, Instagram, Music2 } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">Have questions? We're here to help. Reach out to us through any of the channels below.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-primary font-bold">+1 (234) 567-890</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9am-6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-primary font-bold">support@zfour.com</p>
                    <p className="text-sm text-gray-500">Online support 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Office</p>
                    <p className="text-primary font-bold">123 Fashion Street</p>
                    <p className="text-sm text-gray-500">New York, NY 10001</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-50">
                <h3 className="text-sm font-bold text-primary mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-accent hover:text-white transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-accent hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-accent hover:text-white transition-all">
                    <Music2 size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-accent p-8 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} />
                <h3 className="text-xl font-bold">Business Hours</h3>
              </div>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <h2 className="text-3xl font-bold text-primary mb-2">Send us a Message</h2>
              <p className="text-gray-500 mb-10">Fill out the form below and our team will get back to you within 24 hours.</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help you?" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary ml-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Tell us more about your inquiry..." 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                  ></textarea>
                </div>

                <button className="w-full md:w-auto px-12 py-5 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="aspect-[21/9] bg-gray-200 rounded-[3rem] overflow-hidden relative group">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
            alt="Map" 
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-primary">zFour HQ</p>
                <p className="text-xs text-gray-500">123 Fashion Street, NY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
