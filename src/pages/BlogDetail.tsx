import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { Calendar, User, ArrowLeft, ChevronRight, Share2, MessageCircle, Heart, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, loading } = useBlogs();
  
  const blog = blogs.find(b => b._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Loading Story...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <h2 className="text-4xl font-black text-primary mb-4 uppercase tracking-tighter italic">Story Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">The blog post you're looking for might have been moved or removed from our journal.</p>
        <Link to="/blog" className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-xl shadow-primary/20">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Article Hero */}
      <div className="relative h-[60vh] sm:h-[80vh] overflow-hidden group">
        <img 
          src={blog.imageURL} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-4 pb-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-accent text-white text-[10px] sm:text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                  {blog.category}
                </span>
                <div className="h-[1px] w-8 bg-white/30 hidden sm:block"></div>
                <div className="flex items-center gap-4 text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-accent" />
                    <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-accent" />
                    <span>5 Min Read</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white leading-[1.1] mb-8 italic tracking-tight">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-0.5">
                  <img 
                    src="https://ui-avatars.com/api/?name=Zfour+Admin&background=e11d48&color=fff" 
                    alt="Author" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Zfour Collections</p>
                  <p className="text-white/50 text-[10px] uppercase font-black tracking-widest">Main Curator</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl shadow-black/5 border border-gray-50">
          {/* Article Header Summary */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <p className="text-xl sm:text-2xl font-serif italic text-primary leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-accent">
              {blog.description}
            </p>
          </div>

          {/* Social Interactions Float */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-accent hover:text-white rounded-full transition-all text-xs font-black uppercase tracking-widest group">
                <Heart size={16} className="text-accent group-hover:text-white group-hover:scale-125 transition-all" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-full transition-all text-xs font-black uppercase tracking-widest group">
                <Share2 size={16} className="group-hover:rotate-12 transition-all" />
                <span>Share</span>
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <MessageCircle size={16} />
                <span>0 Comments</span>
              </div>
            </div>
          </div>

          {/* Dummy Body Content to make it detailed */}
          <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-[1.8]">
            <p className="mb-8">
              Welcome to our seasonal boutique showcase. In this feature, we take an intimate look at the craftsmanship behind the collection, highlighting the intricate details that define modern luxury ethnic wear. Our design philosophy centers on the marriage of traditional heritage techniques with contemporary silhouettes, creating pieces that are both timeless and forward-thinking.
            </p>
            
            <h3 className="text-2xl font-black text-primary uppercase tracking-tight italic mb-6 mt-12">The Artisanal Touches</h3>
            <p className="mb-8">
              Every embroidery pattern tells a story. From the delicateResham work of Southern Punjab to the geometric patterns of the northern valleys, we've integrated diverse cultural motifs to create a unified aesthetic of elegance. The choice of palette reflects the changing seasons, subtly shifting from warm earth tones to vibrant jewel-like hues that capture the light in every movement.
            </p>

            <div className="my-12 rounded-[2rem] overflow-hidden bg-gray-50 p-1 md:p-2 border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop" 
                alt="Craft Background" 
                className="w-full h-[300px] object-cover rounded-[1.5rem]"
                referrerPolicy="no-referrer"
              />
              <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-4 mb-2">Detailed Craftsmanship & Fabric Texture</p>
            </div>

            <p className="mb-8">
              The selection of fabrics forms the foundation of our boutique experience. We source only the finest variety of cotton lawn, silk, and chiffon, ensuring that every garment provides not just visual splendor but an unparalleled sense of comfort. Our quality control process is rigorous, with each suit undergoing individual inspection to maintain the highest standards of the zFour legacy.
            </p>

            <p className="mb-8 italic border-l-4 border-accent pl-8 py-4 bg-accent/5 rounded-r-2xl font-serif text-xl text-primary">
              "True luxury isn't just about what you see, but how it makes you feel—confident, elegant, and connected to the artistry of couture."
            </p>

            <p>
              As we continue to evolve our collections, we invite you to be part of our journey. Stay connected for more deep dives into fashion care, styling tips for festive seasons, and exclusive behind-the-scenes glimpses into our design house.
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-20 flex justify-center">
            <Link 
              to="/blog" 
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-primary hover:text-accent transition-all"
            >
              <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                <ArrowLeft size={18} />
              </div>
              Explore more from our journal
            </Link>
          </div>
        </div>

        {/* Navigation to next/prev blogs could be added here */}
      </div>
    </div>
  );
};

export default BlogDetail;
