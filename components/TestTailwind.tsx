import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind CSS Test</h1>
      <p className="mt-4 text-gray-700">
        This is a test component to verify Tailwind CSS is working correctly.
      </p>
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-800">
          If you see styled text and a blue background, Tailwind CSS is working!
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Primary Button
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          Secondary Button
        </button>
      </div>
    </div>
  );
};

export default TestTailwind;
