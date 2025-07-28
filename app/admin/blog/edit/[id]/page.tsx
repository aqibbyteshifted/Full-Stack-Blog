'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm, { BlogFormData } from '@/components/BlogForm';

// This is a client component, so we'll use useParams hook for type safety
export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  
  // Safely extract the ID from params with type assertion
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : '';
  
  // State management
  const [initialData, setInitialData] = useState<BlogFormData>({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    imageUrl: '',
    tags: [],
    featured: false,
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch blog data when component mounts or ID changes
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        router.push('/admin/blog');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/blogs/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blog');
        }
        
        const data = await response.json();
        
        setInitialData({
          id: data.id, // ADDED: Include the ID
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

    fetchBlog();
  }, [id, router]);

  const handleSubmit = async (data: BlogFormData) => {
    if (!id) {
      setError('Invalid blog ID');
      return;
    }

    try {
      setIsLoading(true);
      
      // Add debugging
      console.log('Submitting data:', data);
      console.log('Blog ID:', id);
      
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: parseInt(id), // Ensure ID is included as number
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to update blog');
      }

      const result = await response.json();
      console.log('Success result:', result);

      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
      console.error('Error:', err);
      throw err; // Re-throw so the form can handle it
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialData.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error && !initialData.title) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/admin/blog')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <BlogForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
        />
      </div>
    </div>
  );
}