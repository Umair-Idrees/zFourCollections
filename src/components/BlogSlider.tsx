import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const blogs = [
  {
    id: 1,
    title: "Luxury Crimson Edit",
    image: "https://zfourcollections.com/wp-content/uploads/2026/04/1-1-2048x1150.png",
    description: "Discover our latest crimson collection with intricate hand-embroidered details."
  },
  {
    id: 2,
    title: "Summer Lawn Series",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200",
    description: "Breezy summer lawn suits perfect for the tropical garden vibe."
  },
  {
    id: 3,
    title: "The Silk Tradition",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1200",
    description: "Pure silk unstitched fabrics curated for the modern ethnic wardrobe."
  },
  {
    id: 4,
    title: "Ready-To-Wear Pret",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200",
    description: "Effortless style in our new ready-to-wear pret collection."
  },
  {
    id: 5,
    title: "Boutique Craftsmanship",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6039?auto=format&fit=crop&q=80&w=1200",
    description: "Behind the scenes of our master craftsmen at work."
  },
  {
    id: 6,
    title: "Western Fusion",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200",
    description: "Modern co-ord sets blending western silhouettes with eastern textures."
  },
  {
    id: 7,
    title: "Accessories Portfolio",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
    description: "The perfect finishing touches for your luxury boutique look."
  }
];

const BlogSlider: React.FC = () => {
  const [ref, { width }] = useMeasure();

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Journal</span>
          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight uppercase tracking-tighter inline-block">
            LATEST FROM THE <span className="text-accent relative inline-block">
              BLOG
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-accent" />
            </span>
          </h2>
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
            loop={true}
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
              <SwiperSlide key={blog.id}>
                <motion.div 
                  className="group relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-gray-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700"
                  whileHover={{ y: -10 }}
                >
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <h3 className="text-2xl font-black text-white mb-3">{blog.title}</h3>
                      <p className="text-white/70 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">{blog.description}</p>
                      <span className="inline-flex items-center gap-3 text-xs font-black text-white uppercase tracking-widest border-b-2 border-accent pb-1 group/btn transition-all">
                        Read Exclusive Article
                      </span>
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
