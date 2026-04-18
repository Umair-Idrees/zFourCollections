import React from 'react';
import { Calendar, User, ArrowRight, MessageCircle } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Ultimate Guide to Summer Fashion 2024",
    excerpt: "Discover the hottest trends this summer, from vibrant linen sets to sustainable accessories that will elevate your style.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    author: "Zfour Team",
    date: "May 15, 2024",
    category: "Fashion"
  },
  {
    id: 2,
    title: "How to Choose the Perfect Watch for Any Occasion",
    excerpt: "A watch is more than just a timepiece; it's a statement. Learn how to match your watch with your outfit and lifestyle.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
    author: "Alex Rivera",
    date: "May 10, 2024",
    category: "Accessories"
  },
  {
    id: 3,
    title: "Sustainable Tech: The Future of Electronics",
    excerpt: "Explore how the tech industry is moving towards more eco-friendly materials and energy-efficient designs.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800",
    author: "Tech Insights",
    date: "May 05, 2024",
    category: "Electronics"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Blog</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">Stay updated with the latest trends, tips, and news from the world of fashion and technology.</p>
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
        <div className="mt-20 bg-accent rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto">Get the latest blog posts and exclusive offers delivered straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/20 border border-white/30 rounded-2xl py-4 px-6 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-accent px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
