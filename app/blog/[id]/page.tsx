import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export default async function BlogPost({ params }: { params: { id: string } }) {
  // Get the blog post with all its fields
  const blog = await prisma.blog.findUnique({
    where: { id: Number(params.id) },
    include: {
      comments: true
    }
  }) as Awaited<ReturnType<typeof prisma.blog.findUnique>>;

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
              {blog.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h1>
          {blog.subtitle && (
            <h2 className="text-xl text-gray-600 mb-6">{blog.subtitle}</h2>
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-500">
                  Published on {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <a
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← Back to all posts
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'Published' },
    select: { id: true },
  });

  return blogs.map((blog) => ({
    id: blog.id.toString(),
  }));
}
