import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlogs, Blog } from '../context/BlogContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BlogSlider: React.FC = () => {
  const [ref, { width }] = useMeasure();
  const { blogs, loading } = useBlogs();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="text-left">
            <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Journal</span>
            <h2 className="text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tighter inline-block">
              LATEST FROM THE <span className="text-accent relative inline-block">
                BLOG
                <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-accent" />
              </span>
            </h2>
          </div>
          
          <Link to="/blog" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-all">
            View All Stories
            <div className="w-8 h-8 rounded-full bg-linen flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <ChevronRight size={14} />
            </div>
          </Link>
        </div>

        <div className="relative group/arrows">
          {/* Side Navigation Arrows */}
          <button className="blog-prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300 opacity-0 group-hover/arrows:opacity-100 cursor-pointer hidden xl:flex border border-gray-100">
            <ChevronLeft size={18} />
          </button>
          <button className="blog-next-btn absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300 opacity-0 group-hover/arrows:opacity-100 cursor-pointer hidden xl:flex border border-gray-100">
            <ChevronRight size={18} />
          </button>

          {/* Mobile Arrows */}
          <div className="flex items-center justify-center gap-3 mb-8 xl:hidden">
            <button className="blog-prev-btn w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300">
              <ChevronLeft size={16} />
            </button>
            <button className="blog-next-btn w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300">
              <ChevronRight size={16} />
            </button>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={blogs.length > 3}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              className: "pt-12",
            }}
            navigation={{
              prevEl: '.blog-prev-btn',
              nextEl: '.blog-next-btn',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
            className="blog-swiper pb-16"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog._id}>
                <motion.div 
                  className="group relative aspect-[3/4] sm:aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-gray-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700"
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <img 
                    src={blog.imageURL} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-10">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">{blog.title}</h3>
                      <p className="text-white/70 text-xs sm:text-sm font-medium line-clamp-2 mb-6 sm:mb-8 leading-relaxed">{blog.description}</p>
                      <Link to={`/blog/${blog._id}`} className="inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black text-white uppercase tracking-widest border-b-2 border-accent pb-1 group/btn transition-all" onClick={(e) => e.stopPropagation()}>
                        Read Exclusive Article
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-swiper .swiper-pagination-bullet {
          background: #000;
          opacity: 0.1;
          width: 10px;
          height: 10px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: var(--color-accent, #e11d48);
          width: 30px;
          border-radius: 5px;
        }
      `}} />
    </section>
  );
};

export default BlogSlider;
