
import React from 'react';
import { Link } from 'react-router-dom';
import type { Space } from '../../types';
import { MapPin, Users, Calendar } from 'lucide-react';

interface SpaceCardProps {
  space: Space;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const { _id, title, description, category, location, capacity, price, images } = space;
  
  return (
    <div className="card overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <img 
          src={images.length > 0 ? images[0].mediaUrl : '/placeholder.svg'} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium">
          €{price}/hr
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {description}
        </p>
        
        <div className="flex flex-col space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location.city}, {location.country}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Capacity: {capacity}</span>
          </div>
        </div>
        
        <Link
          to={`/spaces/${_id}`}
          className="mt-4 btn btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SpaceCard;
