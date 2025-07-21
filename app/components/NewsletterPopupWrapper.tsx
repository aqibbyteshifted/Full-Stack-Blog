'use client';
import dynamic from 'next/dynamic';

const NewsletterPopup = dynamic(
  () => import('@/components/newsLetter/page').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function NewsletterPopupWrapper() {
  return <NewsletterPopup />;
}
