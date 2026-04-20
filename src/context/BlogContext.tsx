import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Blog {
  _id: string;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  createdAt: string;
}

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  addBlog: (blogData: Omit<Blog, '_id' | 'createdAt'>) => Promise<Blog>;
  fetchBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const MOCK_BLOGS: Blog[] = [
  {
    _id: '1',
    title: "Luxury Crimson Edit",
    imageURL: "https://zfourcollections.com/wp-content/uploads/2026/04/1-1-2048x1150.png",
    description: "Discover our latest crimson collection with intricate hand-embroidered details.",
    category: "New Arrival",
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: "Summer Lawn Series",
    imageURL: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200",
    description: "Breezy summer lawn suits perfect for the tropical garden vibe.",
    category: "Styling Tips",
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: "The Silk Tradition",
    imageURL: "https://media.istockphoto.com/id/488216826/photo/girl-chooses-dresses.jpg?s=612x612&w=0&k=20&c=0ytRJDf7cd_CJFvtGpktcynKAy49-OWFuGky60TeTKI=",
    description: "Pure silk unstitched fabrics curated for the modern ethnic wardrobe.",
    category: "Fabric Care",
    createdAt: new Date().toISOString()
  }
];

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>(MOCK_BLOGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Only update if there are blogs in the database
        if (data && data.length > 0) {
          setBlogs(data);
        }
        setError(null);
      }
    } catch (err: any) {
      console.warn('Blogs fetch was interrupted or server is starting up.');
      // Don't set error state yet if it's a routine fetch failure on startup
    } finally {
      setLoading(false);
    }
  };

  const addBlog = async (blogData: Omit<Blog, '_id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) throw new Error('Failed to add blog');
      const newBlog = await response.json();
      setBlogs((prev) => [newBlog, ...prev]);
      return newBlog;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading, error, addBlog, fetchBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};
