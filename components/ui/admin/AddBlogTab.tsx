"use client";
import React, { useState } from "react";
import { useForm } from "@/lib/hooks/use-form";
import { blogPostSchema } from "@/lib/validations";

export default function AddBlogTab() {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
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
          throw new Error(`Validation failed: ${data.errors.map((e: any) => e.message).join(', ')}`);
        }
        throw new Error(data.error || 'Failed to create blog');
      }

      // Reset form on success
      resetForm();
      setHasAttemptedSubmit(false); // Reset the submit attempt flag
      alert('Blog post created successfully!');
    }
  });

  // Custom submit handler to track attempts
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    handleSubmit(e);
  };

  return (
    <form onSubmit={onFormSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => handleChange('title')(e.target.value)}
          placeholder="Enter blog title"
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          id="subtitle"
          name="subtitle"
          value={values.subtitle || ''}
          onChange={(e) => handleChange('subtitle')(e.target.value)}
          placeholder="Enter a short subtitle (optional)"
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {hasAttemptedSubmit && errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label
                htmlFor="featuredImage"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
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
            <img
              src={values.featuredImage}
              alt="Preview"
              className="h-32 w-auto rounded-md border border-gray-300"
            />
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
          <input
            id="category"
            name="category"
            value={values.category}
            onChange={(e) => handleChange('category')(e.target.value)}
            placeholder="e.g., Technology, Lifestyle, Food"
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {hasAttemptedSubmit && errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="published"
            name="published"
            value={values.published ? 'true' : 'false'}
            onChange={(e) => handleChange('published')(e.target.value === 'true')}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  );
}