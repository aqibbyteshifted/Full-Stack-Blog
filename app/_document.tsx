import { Html, Head, Main, NextScript } from 'next/document';
import { barlow } from '@/lib/fonts';

export default function Document() {
  return (
    <Html lang="en" className={`${barlow.variable} font-sans`}>
      <Head>
        <link
          rel="preload"
          href="/fonts/Barlow-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
