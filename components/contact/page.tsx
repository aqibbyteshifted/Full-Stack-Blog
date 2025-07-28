import React from 'react';
import Breadcrumb from './Breadcrumb';
import ContactIntro from './ContactIntro';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import SocialMedia from './SocialMedia';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Main Content */}
        <div className="mt-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact</h1>
            <ContactIntro />
          </div>
          
          {/* Contact Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ContactInfo 
              title="Contact"
              address="Lorem 142..., 2362..., State, USA"
              phone="01-23456789"
              email="contact@athena.io"
              description="If you would like to partner with Athena at our next event, contact us at contact@athena.io."
            />
            
            <ContactInfo 
              title="Advertise with us"
              description="Please contact us directly at ads@athena.io. For large or unique campaigns please email sale@athena.io for requests-for-proposal pricing information."
            />
            
            <ContactInfo 
              title="Partnerships"
              description="We are a professional event management team starting in 2012. Please send request details to email event@athena.io."
            />
          </div>
          
          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Get in touch</h2>
            <ContactForm />
          </div>
          
          {/* Social Media Section */}
          <div className="mt-16">
            <SocialMedia />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
