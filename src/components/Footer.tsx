import React from 'react';
import { Facebook, Instagram, Music2, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/share/1AnztTsb53/?mibextid=wwXIfr" },
    { Icon: Instagram, href: "https://www.instagram.com/zfour_collections?igsh=MTRxZDVpN3I3bDAycQ%3D%3D&utm_source=qr" },
    { Icon: Music2, href: "https://www.tiktok.com/@zfour.collections?_r=1&_t=ZS-93RlJwUsagS" }
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="mb-6">
              <Logo variant="dark" className="scale-125 origin-left" />
            </div>
            <p className="text-gray-500 mb-8 leading-relaxed">
              CareNexon Luxury Boutique offers a curated collection of premium fabrics, festive formals, and modern pret. Discover elegance and craftsmanship in every piece.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-accent hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              {['About Us', 'Shop Collection', 'New Arrivals', 'Best Sellers', 'Special Offers', 'Blog Posts'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-accent transition-colors flex items-center group">
                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6 uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-4">
              {['My Account', 'Order Tracking', 'Wishlist', 'Terms & Conditions', 'Privacy Policy', 'Returns & Exchanges'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-accent transition-colors flex items-center group">
                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  CareNexon Punjab Coperative Housing Socienty(PCHS), Pakistan, Lahore
                </p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Phone size={18} />
                </div>
                <p className="text-gray-500 text-sm font-bold">0339300639</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Mail size={18} />
                </div>
                <p className="text-gray-500 text-sm font-bold">carenexon143@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © 2026 CareNexon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
