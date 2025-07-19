'use client';

import dynamic from 'next/dynamic';

// Create a client-side only version of the NewsletterPopup
const NewsletterPopup = dynamic(
  () => import('./NewsletterPopup').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function NewsletterPopupWrapper() {
  return <NewsletterPopup />;
}
