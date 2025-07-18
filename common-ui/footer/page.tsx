"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-8 mt-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="flex flex-col items-start space-y-4">
          <Image
            src="/logo-dark.png"
            width={120}
            height={120}
            alt="Creative Magazine Logo"
            className="w-16 sm:w-20 lg:w-24 h-auto "
          />
          <h4 className="text-xs sm:text-sm lg:text-base font-light text-athena-red hover:text-red-500 transition-colors">
            Creative Magazine
          </h4>
        <div>
            <Button
            className="bg-gradient text-white border mx-auto border-white rounded-none px-4 py-2 text-xs sm:text-sm lg:text-base hover:bg-white hover:text-black transition-colors"
          >
            Subscribe
          </Button>
        </div>
        </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/pages" className="text-gray-400 hover:text-red-500 transition-colors">Pages</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-red-500 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/technology" className="text-gray-400 hover:text-red-500 transition-colors">Technology</Link></li>
              <li><Link href="/travel" className="text-gray-400 hover:text-red-500 transition-colors">Travel</Link></li>
              <li><Link href="/fashion" className="text-gray-400 hover:text-red-500 transition-colors">Fashion</Link></li>
              <li><Link href="/health" className="text-gray-400 hover:text-red-500 transition-colors">Health & Fitness</Link></li>
            </ul>
          </div>

          {/* Social and Newsletter */}
          <div>
            <h4 className="text-lg font-medium mb-4">Connect With Us</h4>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaYoutube size={20} />
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 rounded-l-md text-black focus:outline-none"
                  />

                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="text-center text-sm text-gray-400">
          © 2025 Athena Magazine. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;