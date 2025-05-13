import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { spacesAPI } from '../services/api';
import type { Space } from '../types';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch featured spaces data (limit to 3 spaces)
  const { 
    data: spaces, 
    isLoading
  } = useQuery({
    queryKey: ['spaces', 'featured'],
    queryFn: async () => {
      try {
        const response = await spacesAPI.getAll();
        // Return only 3 spaces for the featured section
        return response.data.slice(0, 3);
      } catch (error) {
        toast.error('Failed to load featured spaces');
        throw error;
      }
    }
  });

  const testimonials = [
    {
      text: "I found the perfect meeting room for our client presentations. The booking process was smooth and the space exceeded our expectations.",
      name: "Sarah Anderson",
      role: "Marketing Director",
      initials: "SA"
    },
    {
      text: "As a freelancer, finding quiet places to work is crucial. This platform has helped me discover amazing coworking spaces in every city I visit.",
      name: "Michael Johnson",
      role: "Freelance Designer",
      initials: "MJ"
    },
    {
      text: "We hosted our company retreat in one of the event spaces. The amenities were top-notch and everyone had a great time.",
      name: "Elena Petrova",
      role: "HR Manager",
      initials: "EP"
    }
  ];

  // Space hover animation states
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Animations */}
      <div 
        id="hero-section"
        className="relative bg-gradient-to-r from-blue-700 to-indigo-800 py-24 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('')]"></div>
          
          {/* Animated floating shapes */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-indigo-400/20 animate-float-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-purple-400/10 animate-float"></div>
        </div>
        
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left md:max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200">
                <span className="block overflow-hidden">
                  <span className="block transform transition-transform duration-1000 delay-300 translate-y-0 opacity-100">
                    Find Your Perfect
                  </span>
                </span>
                <span className="block overflow-hidden text-blue-200">
                  <span className="block transform transition-transform duration-1000 delay-500 translate-y-0 opacity-100">
                    Space
                  </span>
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 transition-all duration-1000 delay-700">
                Discover and book unique spaces for work, meetings, events, and more. 
                The right environment can transform how you work and create.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start transition-all duration-1000 delay-900">
                <Link
                  to="/spaces"
                  className="btn px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 
                    transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Browse All Spaces
                </Link>
                <Link
                  to="/about"
                  className="btn px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg 
                    hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-2/5 mt-6 md:mt-0 transition-all duration-1000 delay-500">
              <div className="relative transform hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div className="absolute -top-4 -right-4 w-full h-full bg-blue-400 rounded-xl animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -left-4 w-full h-full bg-indigo-400 rounded-xl animate-float-slow"></div>
                <img 
                  src="/workspace-image.jpg" 
                  alt="Modern workspace" 
                  className="w-full h-auto rounded-xl relative z-10 shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.yeastar.com/wp-content/uploads/2023/06/desk-booking-system-image.webp";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spaces with Improved Cards and Animations */}
      <div 
        id="featured-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className={`text-center mb-12 transition-all duration-1000 '}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Spaces
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular spaces that cater to various needs and preferences
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spaces?.map((space: Space, index: number) => (
              <div 
                key={space._id} 
                className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                  transition-all duration-500 transform 
                  ${hoveredSpace === space._id ? 'scale-105 -translate-y-2' : 'scale-100'}
                  '}`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredSpace(space._id)}
                onMouseLeave={() => setHoveredSpace(null)}
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={space.images.length > 0 ? space.images[0].mediaUrl : "/placeholder.svg"}
                    alt={space.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredSpace === space._id ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {space.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold shadow-lg transform transition-transform duration-300 hover:scale-110">
                    €{space.price}/hr
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{space.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{space.description}</p>
                  <div className="flex items-center text-gray-500 mb-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{space.location.city}, {space.location.country}</span>
                    <span className="mx-2">•</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm">Capacity: {space.capacity}</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <Link
                      to={`/spaces/${space._id}`}
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-lg transition-all duration-300 transform hover:translate-y-0"
                    >
                      View Details
                    </Link>
                    {hoveredSpace === space._id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-600 transform translate-y-full animate-slide-up">
                        <span className="text-white font-medium">Book Now</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`mt-12 text-center transition-all duration-1000 delay-500 '}`}>
          <Link
            to="/spaces"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            View All Spaces
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* How It Works with Interactive Icons */}
      <div 
        id="how-it-works-section"
        className="bg-gray-50 py-20 relative overflow-hidden"
      >
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 '}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Finding and booking your ideal space is simple with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div 
              className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-500 transform hover:scale-105 
                '}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12 cursor-pointer">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Browse Spaces</h3>
              <p className="text-gray-600">
                Search through our curated selection of spaces and find one that meets your specific requirements.
              </p>
            </div>
            
            <div 
              className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-500 transform hover:scale-105 
                '}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12 cursor-pointer">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Book Your Space</h3>
              <p className="text-gray-600">
                Select your preferred dates and times, complete your reservation, and receive instant confirmation.
              </p>
            </div>
            
            <div 
              className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-500 transform hover:scale-105 
                '}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12 cursor-pointer">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Enjoy Your Space</h3>
              <p className="text-gray-600">
                Arrive at your chosen space, follow the access instructions, and use the space for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Carousel */}
      <div 
        id="testimonials-section"
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 '}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from people who have found their perfect spaces through our platform
            </p>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-300 '}`}>
            <div className="flex overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`w-full flex-shrink-0 transition-all duration-700 transform ${
                    index === activeTestimonial ? 'translate-x-0 opacity-100 scale-100' : 
                    index < activeTestimonial ? '-translate-x-full opacity-0 scale-95' : 
                    'translate-x-full opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 relative max-w-3xl mx-auto">
                    <svg className="w-12 h-12 text-blue-300 absolute top-4 right-4 opacity-40" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-600 mb-6 italic text-lg">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-200 mr-4 flex items-center justify-center">
                        <span className="font-semibold text-blue-700">{testimonial.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-blue-200'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            {/* Arrow Navigation */}
            <button
              onClick={() => setActiveTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)}
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 text-blue-700 transform transition-transform hover:scale-110"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 text-blue-700 transform transition-transform hover:scale-110"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>      

      {/* CTA Section with Interactive Elements */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Animated circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/20 animate-float-slow"></div>
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-indigo-500/20 animate-float"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your perfect space?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their ideal spaces with us. Start browsing our collection today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/spaces"
              className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                Browse Spaces
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            <Link
              to="/signup"
              className="group px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                Sign Up Now
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile App Banner - New! */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute right-0 top-0 h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="25" r="20" fill="white" fillOpacity="0.1" />
                <circle cx="90" cy="60" r="15" fill="white" fillOpacity="0.1" />
                <circle cx="60" cy="80" r="25" fill="white" fillOpacity="0.1" />
              </svg>
            </div>
            
            <div className="text-center md:text-left z-10 md:max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Get Our Mobile App</h2>
              <p className="text-blue-100 mb-6">
                Book spaces on the go, receive instant notifications, and manage your bookings anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5225 12.0055C17.5095 9.53052 19.5455 8.16352 19.6535 8.09352C18.4975 6.46052 16.7415 6.21952 16.0995 6.20652C14.6255 6.05252 13.1985 7.09452 12.4505 7.09452C11.6855 7.09452 10.5135 6.22352 9.29651 6.24952C7.70251 6.27552 6.25651 7.16752 5.45151 8.53752C3.78851 11.3145 5.00651 15.4265 6.59951 17.8355C7.39551 19.0145 8.32551 20.3395 9.55951 20.2985C10.7675 20.2535 11.2215 19.5355 12.6935 19.5355C14.1475 19.5355 14.5715 20.2985 15.8345 20.2715C17.1345 20.2535 17.9345 19.0985 18.6975 17.9055C19.6175 16.5395 20.0035 15.1945 20.0155 15.1415C19.9835 15.1315 17.5375 14.2035 17.5225 12.0055Z" />
                    <path d="M15.7993 4.5C16.4473 3.71 16.8833 2.66 16.7553 1.6C15.8493 1.64 14.7233 2.25 14.0433 3.02C13.4403 3.7 12.9173 4.78 13.0613 5.82C14.0893 5.89 15.1293 5.28 15.7993 4.5Z" />
                  </svg>
                  App Store
                </a>
                <a href="#" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.17346 3.17236C3.65346 3.69236 3.39746 4.43236 3.39746 5.35236V18.6524C3.39746 19.5724 3.65346 20.3124 4.17346 20.8324L4.27746 20.9364L13.2525 11.9634V11.8634L4.27746 2.89236L4.17346 3.17236Z" />
                    <path d="M17.0995 15.8124L13.2495 11.9624V11.8624L17.0995 8.01237L17.2235 8.08237L21.8775 10.7424C23.0795 11.4524 23.0795 12.6424 21.8775 13.3624L17.2235 15.7424L17.0995 15.8124Z" />
                    <path d="M17.2236 15.7425L13.2496 11.9625L4.17358 21.0325C4.57358 21.4125 5.17358 21.4125 5.89358 21.1225L17.2236 15.7425Z" />
                    <path d="M17.2236 8.08238L5.89358 2.88238C5.17358 2.60238 4.57358 2.60238 4.17358 2.96238L13.2496 11.8624L17.2236 8.08238Z" />
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0 z-10 transform hover:scale-105 transition-all duration-500 hover:rotate-2">
              <div className="relative">
                <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-x-2 translate-y-2"></div>
                <img 
                  src="/mobile-app.png" 
                  alt="Mobile App" 
                  className="max-w-xs rounded-3xl relative z-10 shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;