import { Instagram } from 'lucide-react';
import Image from 'next/image';

const SocialMedia = () => {
  const instagramImages = [
    { id: 1, src: '/footer/chair.jpg', alt: 'Chair' },
    { id: 2, src: '/footer/decoration.jpg', alt: 'Decoration' },
    { id: 3, src: '/footer/gate.jpg', alt: 'Gate' },
    { id: 4, src: '/footer/hall.jpg', alt: 'Hall' },
    { id: 5, src: '/footer/sceneries.jpg', alt: 'Sceneries' },
    { id: 6, src: '/footer/statue.jpg', alt: 'Statue' },
  ];

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Instagram className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        <span className="text-lg font-medium text-gray-900 dark:text-white">Athena</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Follow Me On Instagram</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">Followed by: 216.2k</p>
      
      {/* Instagram image grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {instagramImages.map((image) => (
          <div 
            key={image.id}
            className="aspect-square rounded-md overflow-hidden relative hover:opacity-90 transition-opacity"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={image.id <= 3} // Only prioritize loading first 3 images
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
