'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm, { BlogFormData } from '@/components/BlogForm';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      const result = await response.json();
      router.push(`/blog/${result.id}`);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
        <BlogForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
