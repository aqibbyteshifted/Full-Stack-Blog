import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  id: number;
  title: string;
  subtitle: string | null;
  excerpt: string;
  category: string;
  date: string;
  imageUrl?: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
}

export default function BlogCard({
  id,
  title,
  subtitle,
  category,
  date,
  imageUrl,
  author,
  readTime
}: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <div className="h-48 relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {category}
          </span>
          <span className="mx-2">•</span>
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime} read</span>
        </div>
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <Link href={`/blog/${id}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h2>
        {subtitle && (
          <p className="text-gray-600 mb-3 line-clamp-2">{subtitle}</p>
        )}
        <div className="flex items-center mt-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={author.avatar || '/default-avatar.png'}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium">{author.name}</span>
        </div>
      </div>
    </div>
  );
}
