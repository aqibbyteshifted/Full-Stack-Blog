"use client";
import React, { useState } from "react";

export default function AddBlogTab() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    category: "",
    status: "Published",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear any previous errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create blog');
      }

      // Clear form on success
      setForm({ 
        title: "", 
        subtitle: "", 
        content: "", 
        category: "", 
        status: "Published" 
      });
      
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Error creating blog:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
      
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          Blog post created successfully!
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          id="subtitle"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Enter a short subtitle (optional)"
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your blog content here..."
          rows={8}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g., Technology, Lifestyle, Food"
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Published">Published</option>
            <option value="Unpublished">Unpublished</option>
          </select>
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