import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, type NextRequest } from "next/server";
import { blogPostSchema } from "@/lib/validations";
import { prisma } from '@/lib/prisma'

// Types
interface Author {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  bio: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogResponse {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  imageUrl: string | null;
  readTime: number;
  featured: boolean;
  slug: string;
  tags: string[];
  views: number;
  count: {
    Comment: number;
  };
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    bio: string | null;
    website: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// Helper functions
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const createExcerpt = (content: string, length = 150): string => {
  return content.substring(0, length) + (content.length > length ? '...' : '');
};

const formatAuthor = (author: Author | null) => {
  if (!author) {
    return {
      id: 'system',
      name: 'Admin',
      email: 'admin@example.com',
      avatar: '/default-avatar.png',
      role: 'ADMIN',
      bio: 'System Administrator',
      website: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  return {
    id: author.id,
    name: author.name || 'Unknown Author',
    email: author.email || '',
    avatar: author.avatar || '/default-avatar.png',
    role: author.role || 'USER',
    bio: author.bio,
    website: author.website,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString()
  };
};

// API Handlers
export async function GET() {
  try {
    console.log('Fetching all blogs...');

    const blogs = await prisma.blog.findMany({
      include: {
        author: true,
        Comment: true // Include comments to count them
      },
      orderBy: { createdAt: 'desc' },
      where: { status: 'Published' }
    });

    console.log(`Found ${blogs.length} published blogs`);

    const formattedBlogs: BlogResponse[] = blogs.map(blog => {
      const content = blog.content || '';
      const excerpt = blog.excerpt || createExcerpt(content);
      const readTime = blog.readTime || calculateReadTime(content);
      const commentsCount = blog.Comment?.length || 0;

      return {
        id: blog.id,
        title: blog.title || 'Untitled Post',
        subtitle: blog.subtitle,
        content,
        excerpt,
        category: blog.category || 'Uncategorized',
        status: blog.status || 'Draft',
        imageUrl: blog.imageUrl || '/placeholder-blog.jpg',
        readTime,
        featured: blog.featured || false,
        tags: blog.tags || [],
        slug: blog.slug || `post-${blog.id}`,
        views: blog.views || 0,
        count: { Comment: commentsCount },
        Comment: commentsCount,
        commentsCount,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
        author: formatAuthor(blog.author)
      };
    });

    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blogs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    const data = await req.json();
    console.log('Received data:', data);

    const validationResult = blogPostSchema.safeParse(data);
    if (!validationResult.success) {
      console.log('Validation errors:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validationResult.error.issues,
          message: 'Please check your input and try again'
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const slug = createSlug(validatedData.title);
    console.log('Checking for existing slug:', slug);

    const existingBlog = await prisma.blog.findFirst({ where: { slug } });
    console.log('Existing blog check result:', existingBlog);

    const finalSlug = existingBlog ? `${slug}-${Date.now()}` : slug;

    const blogData = {
      title: validatedData.title,
      subtitle: validatedData.subtitle || null,
      content: validatedData.content,
      excerpt: validatedData.excerpt || createExcerpt(validatedData.content),
      category: validatedData.category,
      status: 'Published',
      imageUrl: validatedData.featuredImage || null,
      readTime: calculateReadTime(validatedData.content),
      featured: validatedData.published || false,
      tags: validatedData.tags || [],
      slug: finalSlug,
      views: 0,
    };

    console.log('Blog data to create:', blogData);

    const blog = await prisma.blog.create({
      data: blogData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            bio: true,
            website: true,
            createdAt: true,
            updatedAt: true
          }
        },
        _count: { select: { Comment: true } }
      }
    });

    console.log('Blog created successfully:', blog);

    return NextResponse.json({
      ...blog,
      commentsCount: blog._count?.Comment || 0,
      author: formatAuthor(blog.author)
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A blog with this title already exists' },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to create blog', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid blog ID is required' },
        { status: 400 }
      );
    }

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid blog ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    // Extract update data while ignoring the id from the body
    // Remove id from body since we already have it from URL params
    const { id: _ignoredId, ...updateData } = body as { id?: number;[key: string]: unknown };
    // Verify that the ID in the URL matches the ID in the body for safety
    if (_ignoredId && _ignoredId !== id) {
      return NextResponse.json(
        { error: 'ID in URL does not match ID in request body' },
        { status: 400 }
      );
    }

    const validationResult = blogPostSchema.partial().safeParse(updateData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const updatePayload: Record<string, unknown> = { ...validatedData };

    if (validatedData.title && !validatedData.slug) {
      updatePayload.slug = createSlug(validatedData.title);
    }

    if (validatedData.content) {
      updatePayload.readTime = calculateReadTime(validatedData.content);
      if (!validatedData.excerpt) {
        updatePayload.excerpt = createExcerpt(validatedData.content);
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updatePayload,
      include: {
        author: true,
        _count: {
          select: { Comment: true }
        }
      }
    });

    return NextResponse.json({
      ...updatedBlog,
      commentsCount: updatedBlog._count?.Comment || 0,
      author: formatAuthor(updatedBlog.author)
    });

  } catch (error) {
    console.error('Error updating blog:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}