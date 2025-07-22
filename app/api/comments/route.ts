import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  blogPostId: z.number().int('Blog post ID must be a valid number'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, content, blogPostId } = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        name,
        email,
        content,
        blogPostId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostIdParam = searchParams.get('blogPostId');

    if (!blogPostIdParam) {
      return NextResponse.json(
        { error: 'blogPostId is required' },
        { status: 400 }
      );
    }

    const blogPostId = parseInt(blogPostIdParam, 10);
    
    if (isNaN(blogPostId) || blogPostId <= 0) {
      return NextResponse.json(
        { error: 'Invalid blogPostId. Must be a positive number.' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { blogPostId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}