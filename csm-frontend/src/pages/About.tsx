
import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About Our Platform
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Connecting people with spaces that inspire creativity and productivity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="mb-6">
            Founded in 2023, our platform was created with a simple mission: to make it easy for people to find and book spaces that meet their needs. Whether you're looking for a quiet office, a meeting room, or an event space, we've got you covered.
          </p>
          
          <div className="my-12 bg-blue-50 p-8 rounded-lg border border-blue-100">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Our Vision</h3>
            <p className="text-blue-900">
              We believe that the right environment can transform how people work, collaborate, and create. Our platform connects people with spaces that inspire productivity and creativity.
            </p>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3">Curated Spaces</h3>
              <p>We carefully select each space on our platform to ensure quality and variety for our users.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold mb-3">Easy Booking</h3>
              <p>Our simple booking system makes it quick and painless to reserve the perfect space.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
              <h3 className="text-xl font-bold mb-3">Verified Reviews</h3>
              <p>Read honest feedback from real users to find the ideal space for your needs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-3">Customer Support</h3>
              <p>Our team is here to help you find and book the perfect space for your requirements.</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="mb-10">
            Our diverse team of professionals is passionate about connecting people with inspiring spaces. With backgrounds in real estate, technology, and customer service, we're uniquely positioned to provide an exceptional platform for both space owners and users.
          </p>
          
          <div className="text-center mb-12">
            <Link to="/contact" className="btn btn-primary px-8 py-3">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
