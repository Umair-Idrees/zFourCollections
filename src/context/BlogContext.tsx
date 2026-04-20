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

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
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
        setBlogs(data || []);
        setError(null);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError('Connection refused. Please ensure backend is running.');
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
