'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const commentFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  blogPostId: number;
}

interface CommentSectionProps {
  blogPostId: number; // Changed from string to number to match your schema
}

export default function CommentSection({ blogPostId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          blogPostId, // Already a number from props
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      reset();
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [blogPostId]);

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Leave a Comment</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div>
          <textarea
            placeholder="Your Comment"
            rows={4}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="mt-12">
        <h4 className="text-xl font-semibold mb-6">
          Comments ({comments.length})
        </h4>
        
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{comment.name}</h5>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}