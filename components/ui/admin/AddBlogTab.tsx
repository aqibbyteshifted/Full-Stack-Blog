"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "@/lib/hooks/use-form";
import { blogPostSchema } from "@/lib/validations";
import toast, { Toaster } from 'react-hot-toast';

export default function AddBlogTab() {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm
  } = useForm({
    initialValues: {
      title: "",
      subtitle: "",
      content: "",
      category: "",
      featuredImage: "",
      tags: [],
      published: false
    },
    validationSchema: blogPostSchema,
    onSubmit: async (formValues) => {
      setHasAttemptedSubmit(true);
      
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from server
        if (data.errors) {
          const errorMessage = `Validation failed: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`;
          toast.error(errorMessage, {
            duration: 5000,
            position: 'top-center',
          });
          throw new Error(errorMessage);
        }
        const errorMessage = data.error || 'Failed to create blog';
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
        });
        throw new Error(errorMessage);
      }

      // Reset form on success
      resetForm();
      setHasAttemptedSubmit(false); // Reset the submit attempt flag
      
      // Show success toast
      toast.success('Blog post created successfully!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#059669',
        },
      });
    }
  });

  // Custom submit handler to track attempts
  const generateContentWithAI = async () => {
    if (!values.title || !values.category) {
      toast.error('Please fill in the title and category first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          subtitle: values.subtitle || '',
          category: values.category
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }
      
      const { content } = await response.json();
      handleChange('content')(content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    handleSubmit(e);
  };

  return (
    <div className="space-y-2">
      <Toaster position="top-center" />
      <form onSubmit={onFormSubmit} className="max-w-4xl mx-auto p-2 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Blog Post</h2>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={(e) => handleChange('title')(e.target.value)}
            placeholder="Enter blog title"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded outline-none focus:outline-none focus:ring-0 focus:ring-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {hasAttemptedSubmit && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            value={values.subtitle || ''}
            onChange={(e) => handleChange('subtitle')(e.target.value)}
            placeholder="Enter a short subtitle (optional)"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded outline-none focus:outline-none focus:ring-0 focus:ring-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {hasAttemptedSubmit && errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={generateContentWithAI}
              disabled={isGenerating || !values.title || !values.category}
              className="inline-flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            value={values.content}
            onChange={(e) => handleChange('content')(e.target.value)}
            placeholder="Write your blog content here..."
            rows={8}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded outline-none focus:outline-none focus:ring-0 focus:ring-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {hasAttemptedSubmit && errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>
        
        <div>
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
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
            <div className="flex text-sm text-gray-600 dark:text-gray-300">
              <label
                htmlFor="featuredImage"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload an image</span>
                <input
                  id="featuredImage"
                  name="featuredImage"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Convert file to base64 or handle file upload
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        handleChange('featuredImage')(result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <p className="pl-1 dark:text-gray-400">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
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
                style={{ objectFit: 'contain' }}
                className="rounded-md border border-gray-300 dark:border-gray-600"
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
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            value={values.category}
            onChange={(e) => handleChange('category')(e.target.value)}
            placeholder="e.g., Technology, Lifestyle, Food"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded outline-none focus:outline-none focus:ring-0 focus:ring-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {hasAttemptedSubmit && errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="published"
            name="published"
            value={values.published ? 'true' : 'false'}
            onChange={(e) => handleChange('published')(e.target.value === 'true')}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded outline-none focus:outline-none focus:ring-0 focus:ring-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
          {hasAttemptedSubmit && errors.published && (
            <p className="mt-1 text-sm text-red-600">{errors.published}</p>
          )}
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Blog'}
        </button>
      </div>
    </form>
  </div>
  );
}