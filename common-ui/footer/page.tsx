'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiYoutube, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold mb-2">ATHENA</h2>
            <p className="text-gray-400 mb-6">Creative Magazine</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              ATHENA is a modern and elegant blog & magazine theme. We're excited to share our stories and knowledge with you.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">CATEGORIES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/fashion" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/lifestyle" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/travel" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Travel
                </Link>
              </li>
              <li>
                <Link href="/health" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Health & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">NEWSLETTER</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Subscribe to our newsletter to stay up to date with our latest news and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded-l-md text-black focus:outline-none"
              />
              <button className="bg-white text-black py-2 px-4 rounded-r-md hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="text-center text-sm text-gray-500 pt-4">
          © {new Date().getFullYear()} ATHENA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}