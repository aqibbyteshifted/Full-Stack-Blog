import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper function to validate blog ID
function validateBlogId(id: string) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return { error: 'Invalid blog ID', status: 400 };
  }
  return { id: parsedId };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id, error, status } = validateBlogId(resolvedParams.id);
    if (error) {
      return NextResponse.json({ error }, { status: status || 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// Export both PUT and PATCH methods
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateBlog(request, params, 'PUT');
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateBlog(request, params, 'PATCH');
}

// Common update function for both PUT and PATCH methods
async function updateBlog(
  request: Request,
  params: Promise<{ id: string }>,
  method: 'PUT' | 'PATCH'
) {
  try {
    const resolvedParams = await params;
    const { id, error, status } = validateBlogId(resolvedParams.id);
    if (error) {
      return NextResponse.json({ error }, { status: status || 400 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Prepare update data with all fields from the form
    const updateData = {
      title: data.title,
      subtitle: data.subtitle || '',
      content: data.content,
      category: data.category,
      imageUrl: data.imageUrl || null,
      tags: data.tags || [],
      featured: data.featured || false,
      status: data.status || 'Unpublished',
      updatedAt: new Date(),
    };

    // Update the blog
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id, error, status } = validateBlogId(resolvedParams.id);
    if (error) {
      return NextResponse.json({ error }, { status: status || 400 });
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete the blog
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}