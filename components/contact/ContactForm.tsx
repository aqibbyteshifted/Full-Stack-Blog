'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Check, Loader2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  address: string;
  phone: string;
  subject: string;
  message: string;
  terms: boolean;
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Message sent successfully!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for contacting us. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`block w-full px-4 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`block w-full px-4 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Your Address
          </label>
          <div className="mt-1">
            <input
              id="address"
              type="text"
              {...register('address')}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Your Phone
          </label>
          <div className="mt-1">
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <input
            id="subject"
            type="text"
            {...register('subject', { required: 'Subject is required' })}
            className={`block w-full px-4 py-2 border ${
              errors.subject ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none`}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Your Message <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            rows={4}
            {...register('message', { required: 'Message is required' })}
            className={`block w-full px-4 py-2 border ${
              errors.message ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-none`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            {...register('terms', { required: 'You must accept the terms' })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms and Privacy Policy
            </a>
            <span className="text-red-500"> *</span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-red-600">{errors.terms.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Sending...
            </>
          ) : (
            'SEND'
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
