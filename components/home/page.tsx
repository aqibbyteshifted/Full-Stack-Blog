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
  { id: 'all', name: 'All' },
  { id: 'technology', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'politics', name: 'Politics' },
  { id: 'education', name: 'Education' },
  { id: 'design', name: 'Design' },
  { id: 'marketing', name: 'Marketing' }
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
  const [selectedCategory, setSelectedCategory] = useState('all');
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
          
          // Log the first blog's structure to verify fields
          if (data.length > 0) {
            console.log('First blog object structure:', {
              id: data[0].id,
              title: data[0].title,
              status: data[0].status, // Check if status exists
              category: data[0].category,
              author: data[0].author,
              // Add other important fields
            });
          }
          
          // Show all blogs for now
          console.log('Total blogs received:', data.length);
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
    if (selectedCategory !== 'all') {
      result = result.filter((blog) =>
        blog.category.toLowerCase() === selectedCategory.toLowerCase()
      );
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle filters"
              >
                <FiFilter className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search - Always visible */}
            <div className="md:hidden">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus:ring-none text-sm"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Category Filters */}
        <div className="mb-12 text-center">
          {/* Desktop Search and Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-4">
              {/* Desktop Search - Hidden on mobile */}
              <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus:ring-none text-sm"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus:ring-none text-sm"
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus:ring-none text-sm"
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
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Latest Articles</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                <Link href={`/blog/${blog.id}`} className="block">
                  <div className="relative pt-[56.25%] overflow-hidden">
                    <Image
                      src={blog.imageUrl || '/placeholder-blog.jpg'}
                      alt={blog.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 mb-3">
                      {blog.category}
                    </span>
                    <Link href={`/blog/${blog.id}`} className="block mt-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                        {blog.subtitle || blog.excerpt}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                            <Image
                              src={blog.author?.avatar || '/default-avatar.png'}
                              alt={blog.author?.name || 'Author'}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {blog.author?.name || 'Admin'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <time dateTime={blog.createdAt}>
                              {formatDate(blog.createdAt)}
                            </time>
                            <span className="mx-1">•</span>
                            <span>{blog.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiEye className="h-4 w-4 mr-1" />
                          <span>{blog.views || 0}</span>
                        </span>
                        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiMessageSquare className="h-4 w-4 mr-1" />
                          <span>{blog.tags?.length || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No blog posts found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for new posts.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
