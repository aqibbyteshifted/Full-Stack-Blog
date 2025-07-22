'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiClock, FiCalendar, FiEye, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  imageUrl: string | null;
  readTime: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  views: number;
}

// Format date to relative time (e.g., "2 days ago")
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const categories = [
  'All',
  'Technology',
  'Business',
  'Health',
  'Science',
  'Sports',
  'Entertainment',
  'Politics',
  'Education'
];

const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'popular', name: 'Most Popular' },
];

export default function homePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Use relative URL to avoid CORS issues and environment variables
        const apiUrl = '/api/blogs';
        console.log('Fetching blogs from:', apiUrl);
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Received blogs data:', data);
          // Temporarily show all blogs for debugging
          console.log('All blogs:', data);
          setBlogs(data);
          setFilteredBlogs(data);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch blogs:', errorText);
          // Try fallback URL if the relative path fails
          if (process.env.NEXT_PUBLIC_APP_URL) {
            console.log('Trying fallback URL...');
            const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs`);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              const publishedBlogs = fallbackData.filter((blog: Blog) => blog.status === 'Published');
              setBlogs(publishedBlogs);
              setFilteredBlogs(publishedBlogs);
            } else {
              console.error('Fallback URL also failed:', await fallbackResponse.text());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = [...blogs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.subtitle?.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter((blog) => blog.category === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          // Assuming we have a 'views' field for popularity
          return (b as any).views - (a as any).views || 0;
        default:
          return 0;
      }
    });

    setFilteredBlogs(result);
  }, [blogs, searchQuery, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Blog Posts</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white">
                <div className="flex-shrink-0 h-[400px] relative">
                  <Image
                    src={blog.imageUrl || '/placeholder-blog.jpg'}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      {blog.category}
                    </p>
                    <Link href={`/blog/${blog.id}`} className="block mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {blog.subtitle || blog.excerpt}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{blog.author?.name}</span>
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src={blog.author?.avatar || '/default-avatar.png'}
                          alt={blog.author?.name || 'Author'}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {blog.author?.name || 'Admin'}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={blog.createdAt}>
                          {formatDate(blog.createdAt)}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{blog.readTime} min read</span>
                      </div>
                    </div>
                    <div className="ml-auto flex space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <FiEye className="h-4 w-4 mr-1" />
                        {blog.views || 0}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <FiMessageSquare className="h-4 w-4 mr-1" />
                        {blog.tags?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No blog posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for new posts.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
