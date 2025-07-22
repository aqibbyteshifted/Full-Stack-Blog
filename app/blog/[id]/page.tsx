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
interface BlogPostWithAuthor {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
  } | null;
  comments: any[];
  tags: string[] | null;
  imageUrl: string | null;
  subtitle: string | null;
  readTime: number | null;
  category: string | null;
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  // Get the blog post with author information
  const blog = await prisma.blog.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: {
        select: {
          name: true
        }
      },
      comments: true
    }
  });

  if (!blog) {
    notFound();
  }

  // Cast to our expected type
  const blogWithAuthor = blog as unknown as BlogPostWithAuthor;



  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <FaArrowLeft className="mr-2" />
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>

      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          {/* Author and Date */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-8">
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
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
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
        <div className="prose prose-lg max-w-none mx-auto">
          {blog.subtitle && (
            <p className="text-xl text-gray-600 mb-8 italic">
              {blog.subtitle}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 justify-center">
              {blog.tags.map((tag) => (
                <Link 
                  key={tag as string} 
                  href={`/tags/${(tag as string).toLowerCase()}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
