import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  return (
    <nav className="flex items-center text-sm mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          <span className="text-gray-700 font-medium">Contact</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
