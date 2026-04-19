import React from 'react';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Send, CheckCircle2 } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art of Elegance: 2024 Luxury Lawn Trends",
    excerpt: "Discover the season's most anticipated unstitched collections. From intricate floral embroideries to vibrant summer palettes, explore the trends defining boutique fashion this year.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800",
    author: "Zfour Couture",
    date: "May 15, 2024",
    category: "Fabrics"
  },
  {
    id: 2,
    title: "Pret Perfect: Effortless Style for Every Occasion",
    excerpt: "Why modern women are choosing ready-to-wear boutique suits. Explore our curated selection of 2-piece co-ord sets and festive kurtas designed for comfort and class.",
    image: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=800",
    author: "Style Desk",
    date: "May 10, 2024",
    category: "Ready-to-Wear"
  },
  {
    id: 3,
    title: "A Deep Dive into Luxury: Chiffons & Silks",
    excerpt: "Learn how to identify premium quality fabrics. Our expert guide helps you choose the perfect material for your festive formals and luxury boutique dresses.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800",
    author: "Fabric Specialist",
    date: "May 05, 2024",
    category: "Couture"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-neutral-950 py-24 px-4 text-center relative overflow-hidden">
        {/* Immersive background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop" 
            alt="Fabric Background" 
            className="w-full h-full object-cover opacity-[0.05] mix-blend-overlay blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950/80"></div>
        </div>

        {/* Decorative floral pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none text-white">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-hero-floral" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M50 50 Q70 60 90 50 Q70 40 50 50 M50 50 Q40 70 50 90 Q60 70 50 50 M50 50 Q30 40 10 50 Q30 60 50 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-hero-floral)" />
          </svg>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 italic tracking-tight uppercase">The <span className="text-gold">Fashion</span> Journal</h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">Stay updated with the latest trends, couture insights, and stories from the world of luxury boutique fashion.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="flex items-center gap-2 text-sm font-bold text-primary group/btn">
                  Read More 
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 bg-neutral-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl">
          {/* Immersive background image with overlay */}
          <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop" 
              alt="Fabric Background" 
              className="w-full h-full object-cover blur-[2px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950/90 via-transparent to-neutral-950/90"></div>
          </div>

          {/* Decorative floral pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none text-white">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="blog-floral" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M50 50 Q70 60 90 50 Q70 40 50 50 M50 50 Q40 70 50 90 Q60 70 50 50 M50 50 Q30 40 10 50 Q30 60 50 50" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blog-floral)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Boutique Icon */}
            <div className="mb-6 flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm p-3 rounded-full shadow-sm">
              <Heart size={24} className="text-gold fill-gold/20 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-6 tracking-tight leading-tight italic">
              Join the <span className="text-gold">Fashion Circle</span>
            </h2>
            <p className="text-gray-400 font-medium text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Be the first to know about our new arrivals, trending lawn collections, and <span className="text-white font-bold">exclusive member-only sales</span>.
            </p>

            <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-md mx-auto mb-10">
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="flex-1 bg-transparent border-0 rounded-full py-3 px-6 text-white placeholder:text-gray-500 focus:outline-none transition-all text-sm font-medium"
                  required
                />
                <button className="bg-accent text-white px-8 py-3 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 group shadow-lg">
                  Subscribe
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Sub-features */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/5 w-full">
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-[0.2em] text-[8px]">
                <CheckCircle2 size={12} className="text-gold" />
                <span>No Spam</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-[0.2em] text-[8px]">
                <CheckCircle2 size={12} className="text-gold" />
                <span>Early Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
