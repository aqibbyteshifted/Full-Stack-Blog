'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm, { BlogFormData } from '@/components/BlogForm';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<BlogFormData>({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    imageUrl: '',
    tags: [],
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blog');
        }
        const data = await response.json();
        
        setInitialData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: data.content || '',
          category: data.category || '',
          imageUrl: data.imageUrl || '',
          tags: data.tags || [],
          featured: data.featured || false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    } else {
      setIsLoading(false);
      setError('No blog ID provided');
    }
  }, [params.id]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: 'published',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }
      
      // Show success message and redirect
      alert('Blog updated successfully!');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
      console.error('Error:', err);
      throw err; // Re-throw to be handled by the form
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading blog post</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
        <BlogForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
        />
      </div>
    </div>
  );
}
