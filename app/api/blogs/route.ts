import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, type NextRequest } from "next/server";
import { blogPostSchema } from "@/lib/validations";

const prisma = new PrismaClient();

// Define the shape of the blog data we'll send to the client
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
  tags: string[];
  slug: string;
  views: number;
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

export async function GET() {
  try {
    // Define the type for the blog with author and comment count
    type BlogWithAuthorAndCount = Prisma.BlogGetPayload<{
      include: {
        author: {
          select: {
            id: true;
            name: true;
            email: true;
            avatar: true;
            role: true;
            bio: true;
            website: true;
            createdAt: true;
            updatedAt: true;
          };
        };
        _count: {
          select: {
            comments: true;
          };
        };
      };
    }>;

    console.log('Fetching all blogs...');
    // First, get all blogs with their author and comment counts
    const blogsWithCounts = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        content: true,
        category: true,
        status: true,
        imageUrl: true,
        readTime: true,
        featured: true,
        tags: true,
        slug: true,
        views: true,
        createdAt: true,
        updatedAt: true,
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
        comments: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to include the comment count
    const blogsWithCountsTransformed = blogsWithCounts.map(blog => ({
      ...blog,
      _count: {
        comments: blog.comments.length
      }
    }));

    console.log(`Found ${blogsWithCounts.length} blogs`);
    // Then transform the data for the frontend
    const formattedBlogs = blogsWithCounts.map((blog) => {
      console.log('Processing blog:', { 
        id: blog.id, 
        title: blog.title,
        status: blog.status,
        author: blog.author 
      });
      
      const content = blog.content || '';
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
      
      // Create the blog response object
      const blogData: BlogResponse = {
        id: blog.id,
        title: blog.title || 'Untitled Post',
        subtitle: blog.subtitle || null,
        content: content,
        excerpt: excerpt,
        category: blog.category || 'Uncategorized',
        status: blog.status || 'Draft',
        imageUrl: blog.imageUrl || '/placeholder-blog.jpg',
        readTime: blog.readTime || readTime,
        featured: blog.featured || false,
        tags: blog.tags || [],
        slug: blog.slug || `post-${blog.id}`,
        views: blog.views || 0,
        commentsCount: blog.comments?.length || 0,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : blog.createdAt.toISOString(),
        author: blog.author ? {
          id: blog.author.id,
          name: blog.author.name || 'Unknown Author',
          email: blog.author.email || '',
          avatar: blog.author.avatar || '/default-avatar.png',
          role: blog.author.role || 'USER',
          bio: blog.author.bio || null,
          website: blog.author.website || null,
          createdAt: blog.author.createdAt.toISOString(),
          updatedAt: blog.author.updatedAt.toISOString()
        } : {
          id: 'system',
          name: 'Admin',
          email: 'admin@example.com',
          avatar: '/default-avatar.png',
          role: 'ADMIN',
          bio: 'System Administrator',
          website: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      return blogData;
    });

    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    // Log the incoming request headers for debugging
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    let data;
    try {
      data = await req.json();
      console.log('Received blog data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate data with Zod schema
    const validationResult = blogPostSchema.safeParse(data);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          errors,
          message: 'Please check your input and try again'
        },
        { status: 400 }
      );
    }
    
    // Use validated data
    const validatedData = validationResult.data;

    try {
      // Create slug from title
      const slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Prepare blog data with default values using validated data
      const blogData = {
        title: validatedData.title,
        subtitle: validatedData.subtitle || '',
        content: validatedData.content,
        excerpt: validatedData.excerpt || validatedData.content.substring(0, 150) + (validatedData.content.length > 150 ? '...' : ''),
        category: validatedData.category,
        status: 'Draft', // Always default to Draft for new blogs
        imageUrl: validatedData.featuredImage || null,
        readTime: Math.ceil(validatedData.content.split(/\s+/).length / 200),
        featured: validatedData.published || false,
        tags: validatedData.tags || [],
        slug: slug,
        views: 0,
        authorId: null, // In a real app, get this from the session
      };

      console.log('Creating blog with data:', JSON.stringify(blogData, null, 2));
      
      const blog = await prisma.blog.create({ 
        data: blogData,
      });
      
      console.log('Blog created successfully:', blog.id);
      return NextResponse.json(blog, { status: 201 });
      
    } catch (error) {
      console.error('Database error:', error);
      
      // Handle Prisma specific errors
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
          return NextResponse.json(
            { 
              error: 'Validation error',
              message: 'A blog with this title or slug already exists',
              code: error.code,
              meta: error.meta
            },
            { status: 409 }
          );
        }
        
        // Handle other Prisma errors
        return NextResponse.json(
          { 
            error: 'Database error',
            message: error.message,
            code: error.code,
            meta: error.meta
          },
          { status: 400 }
        );
      }
      
      throw error; // Re-throw for the outer catch
    }
    
  } catch (error) {
    console.error('Unexpected error in POST /api/blogs:', error);
    
    // Handle other types of errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to create blog',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    const data = await req.json();
    
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid blog ID is required' },
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

    // Prepare update data with only allowed fields
    const { 
      title, 
      subtitle, 
      content, 
      category, 
      status, 
      imageUrl, 
      featured, 
      tags,
      slug
    } = data;

    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(content !== undefined && { 
        content,
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        readTime: Math.ceil(content.split(/\s+/).length / 200)
      }),
      ...(category !== undefined && { category }),
      ...(status !== undefined && { status }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(featured !== undefined && { featured }),
      ...(Array.isArray(tags) && { tags }),
      ...(slug !== undefined && { slug }),
    };

    // If title is updated but slug isn't explicitly set, update the slug
    if (title !== undefined && !slug) {
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // First update the blog with the new data
    await prisma.blog.update({ 
      where: { id },
      data: updateData
    });

    // Then fetch the complete blog with all relations using raw SQL
    const [updatedBlog] = await prisma.$queryRaw<Array<{
      id: number;
      title: string | null;
      subtitle: string | null;
      content: string;
      category: string;
      status: string;
      imageUrl: string | null;
      readTime: number | null;
      featured: boolean;
      tags: string[] | null;
      slug: string | null;
      views: number | null;
      createdAt: Date;
      updatedAt: Date;
      author_id: string | null;
      author_name: string | null;
      author_email: string | null;
      author_avatar: string | null;
      author_role: string | null;
      author_bio: string | null;
      author_website: string | null;
      author_createdAt: Date | null;
      author_updatedAt: Date | null;
      comment_count: bigint;
    }>>`
      SELECT 
        b.*,
        u.id as "author_id",
        u.name as "author_name",
        u.email as "author_email",
        u.avatar as "author_avatar",
        u.role as "author_role",
        u.bio as "author_bio",
        u.website as "author_website",
        u."createdAt" as "author_createdAt",
        u."updatedAt" as "author_updatedAt",
        (SELECT COUNT(*) FROM "Comment" c WHERE c."blogId" = b.id) as "comment_count"
      FROM "Blog" b
      LEFT JOIN "User" u ON b."author_id" = u.id
      WHERE b.id = ${id}
      LIMIT 1
    `;

    if (!updatedBlog) {
      throw new Error('Failed to fetch updated blog');
    }

    // Transform the response to match our frontend expectations
    const blogContent = updatedBlog.content || '';
    const wordCount = blogContent.split(/\s+/).length;
    const readTime = updatedBlog.readTime || Math.ceil(wordCount / 200);
    const excerpt = blogContent.substring(0, 150) + (blogContent.length > 150 ? '...' : '');
    const blogTags = Array.isArray(updatedBlog.tags) ? updatedBlog.tags : [];

    const response: BlogResponse = {
      id: updatedBlog.id,
      title: updatedBlog.title || 'Untitled Post',
      subtitle: updatedBlog.subtitle || null,
      content: blogContent,
      excerpt,
      category: updatedBlog.category || 'Uncategorized',
      status: updatedBlog.status || 'Draft',
      imageUrl: updatedBlog.imageUrl || '/placeholder-blog.jpg',
      readTime: Number(readTime),
      featured: updatedBlog.featured || false,
      tags: blogTags,
      slug: updatedBlog.slug || `post-${updatedBlog.id}`,
      views: updatedBlog.views || 0,
      commentsCount: Number(updatedBlog.comment_count) || 0,
      createdAt: new Date(updatedBlog.createdAt).toISOString(),
      updatedAt: new Date(updatedBlog.updatedAt).toISOString(),
      author: updatedBlog.author_id ? {
        id: updatedBlog.author_id,
        name: updatedBlog.author_name || 'Unknown Author',
        email: updatedBlog.author_email || '',
        avatar: updatedBlog.author_avatar || '/default-avatar.png',
        role: updatedBlog.author_role || 'USER',
        bio: updatedBlog.author_bio || null,
        website: updatedBlog.author_website || null,
        createdAt: updatedBlog.author_createdAt ? new Date(updatedBlog.author_createdAt).toISOString() : new Date().toISOString(),
        updatedAt: updatedBlog.author_updatedAt ? new Date(updatedBlog.updatedAt).toISOString() : new Date().toISOString()
      } : {
        id: 'system',
        name: 'Admin',
        email: 'admin@example.com',
        avatar: '/default-avatar.png',
        role: 'ADMIN',
        bio: 'System Administrator',
        website: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}