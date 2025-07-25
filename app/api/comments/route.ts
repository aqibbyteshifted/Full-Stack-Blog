import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  blogId: z.number().int('Blog post ID must be a valid number'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalizedBody = {
      ...body,
      blogId: body.blogId ?? body.blogPostId,
    };
    const { name, content, blogId } = commentSchema.parse(normalizedBody);

    const comment = await prisma.comment.create({
      data: {
        name,
        content,
        blogId,
        status: 'PENDING', // Assuming you want to set a default status
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
    const blogIdParam = searchParams.get('blogId');

    if (!blogIdParam) {
      return NextResponse.json(
        { error: 'blogId is required' },
        { status: 400 }
      );
    }

    const blogId = parseInt(blogIdParam, 10);

    if (isNaN(blogId) || blogId <= 0) {
      return NextResponse.json(
        { error: 'Invalid blogId. Must be a positive number.' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { blogId: blogId },
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