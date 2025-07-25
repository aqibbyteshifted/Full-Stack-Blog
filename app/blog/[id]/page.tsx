import React from 'react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';
import CommentSection from '@/components/blog/CommentSection';

const prisma = new PrismaClient();

// Define the expected blog post type
interface Comment {
  id: number;
  content: string;
  author: {
    name: string | null;
    email: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPostWithAuthor {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
  } | null;
  comments: Comment[];
  tags: string[] | null;
  imageUrl: string | null;
  subtitle: string | null;
  readTime: number | null;
  category: string | null;
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to get the actual values
  const { id } = await params;
  
  // Get the blog post with author information
  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: {
          name: true
        }
      },
      Comment: true
    }
  });

  if (!blog) {
    notFound();
  }

  // Cast to our expected type
  const blogWithAuthor = blog as unknown as BlogPostWithAuthor;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Back Button */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            <FaArrowLeft className="mr-2" />
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>

      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-100 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>
          
          {/* Author and Date */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <FaUser className="mr-1.5" />
              <span>{blog.author?.name || 'Admin'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1.5" />
              <time dateTime={blog.createdAt.toISOString()}>
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <FaClock className="mr-1.5" />
              <span>{blog.readTime || 5} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800/50">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:rounded-lg">
          {blog.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 italic">
              {blog.subtitle}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 justify-center">
              {blog.tags.map((tag) => (
                <Link 
                  key={tag as string} 
                  href={`/tags/${(tag as string).toLowerCase()}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {tag as string}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommentSection blogPostId={blogWithAuthor.id} />
      </div>
    </div>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'Published' },
    select: { id: true },
  });

  return blogs.map((blog) => ({
    id: blog.id.toString(),
  }));
}