'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from '@/lib/hooks/use-form';
import * as z from 'zod';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';
export interface BlogFormData {
  id?: number;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
}

// Define the validation schema
const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(false),
  subtitle: z.string().optional(),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).default([])
});

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const categories = [
  'Technology',
  'Business',
  'Health',
  'Science',
  'Sports',
  'Entertainment',
  'Politics',
  'Education'
];

export default function BlogForm({ 
  initialData, 
  onSubmit,
  isSubmitting = false 
}: BlogFormProps) {
  const router = useRouter();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm
  } = useForm({
    initialValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      content: initialData?.content || '',
      category: initialData?.category || '',
      featuredImage: initialData?.imageUrl || '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
      published: initialData?.featured || false,
    },
    validationSchema: blogPostSchema,
    onSubmit: async (formValues) => {
      setHasAttemptedSubmit(true);
      
      try {
        // If there's a new image, upload it first
        let imageUrl = formValues.featuredImage;
        if (imageFile) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', imageFile);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload image');
          }
          
          const { secure_url } = await uploadResponse.json();
          imageUrl = secure_url;
        }

        // Create the blog post data
        const blogData: BlogFormData = {
          title: formValues.title,
          subtitle: formValues.subtitle || '',
          content: formValues.content,
          category: formValues.category,
          imageUrl: imageUrl || '',
          tags: formValues.tags || [],
          featured: formValues.published || false,
        };

        // If editing, include the ID
        if (initialData?.id) {
          blogData.id = initialData.id;
        }
        await onSubmit(blogData);
        
      } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
      }
    }
  });

  const handleImageUpload = (url: string, file: File) => {
    handleChange('featuredImage')(url);
    setImageFile(file);
  };

  // Custom submit handler to track attempts
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    // Show loading toast
    const toastId = toast.loading('Saving blog post...');
    
    try {
      await handleSubmit(e);
      
      toast.success(initialData?.id ? 'Blog post updated successfully!' : 'Blog post created successfully!', {
        id: toastId,
        duration: 3000,
      });
      
      // Reset form if creating new blog
      if (!initialData?.id) {
        resetForm();
        setHasAttemptedSubmit(false);
      }
    } catch (error) {
      // Update to error state
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the blog post';
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
      });
    }
  };

  return (
    <form onSubmit={onFormSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => handleChange('title')(e.target.value)}
          placeholder="Enter blog title"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-0 focus:border-gray-400"
        />
        {hasAttemptedSubmit && errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={values.subtitle || ''}
          onChange={(e) => handleChange('subtitle')(e.target.value)}
          placeholder="Enter a short subtitle (optional)"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-0 focus:border-gray-400"
        />
        {hasAttemptedSubmit && errors.subtitle && (
          <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={values.content}
          onChange={(e) => handleChange('content')(e.target.value)}
          placeholder="Write your blog content here..."
          rows={8}
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-0 focus:border-gray-400"
        />
        {hasAttemptedSubmit && errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <ImageUpload
                value={values.featuredImage || ''}
                onChange={handleImageUpload}
                label="Upload an image"
              />
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
            <p className="text-xs text-gray-400">
              Recommended size: 1200×630px (2:1 aspect ratio)
            </p>
          </div>
        </div>
        {values.featuredImage && (
          <div className="mt-2">
            <div className="relative h-32 w-full">
              <Image
                src={values.featuredImage}
                alt="Preview"
                fill
                className="rounded-md border border-gray-300 object-contain"
              />
            </div>
          </div>
        )}
        {hasAttemptedSubmit && errors.featuredImage && (
          <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={(e) => handleChange('category')(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-0 focus:border-gray-400"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {hasAttemptedSubmit && errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={Array.isArray(values.tags) ? values.tags.join(', ') : ''}
            onChange={(e) => handleChange('tags')(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="e.g., react, nextjs, typescript"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-0 focus:border-gray-400"
          />
          {hasAttemptedSubmit && errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={values.published}
          onChange={(e) => handleChange('published')(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          Publish this post
        </label>
        {hasAttemptedSubmit && errors.published && (
          <p className="mt-1 text-sm text-red-600">{errors.published}</p>
        )}
      </div>
    
    <div className="pt-2 flex justify-end space-x-3">
      <button
        type="button"
        onClick={() => router.push('/admin')}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Updating...' : 'Update Blog'}
      </button>
    </div>
  </form>
);
}
