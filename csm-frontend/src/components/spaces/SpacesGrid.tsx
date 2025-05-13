
import React from 'react';
import type { Space, SpaceFilters, Category } from '../../types';
import SpaceCard from './SpaceCard';

interface SpacesGridProps {
  spaces: Space[];
  filters?: SpaceFilters;
}

const SpacesGrid: React.FC<SpacesGridProps> = ({ spaces, filters }) => {
  // Apply filters if provided
  const filteredSpaces = filters 
    ? spaces.filter(space => {
        // Filter by category
        if (filters.category && space.category !== filters.category) {
          return false;
        }
        
        // Filter by capacity
        if (filters.capacity && space.capacity < filters.capacity) {
          return false;
        }
        
        // Filter by location
        if (filters.location) {
          const locationString = 
            `${space.location.address} ${space.location.city} ${space.location.postalCode} ${space.location.country}`.toLowerCase();
          if (!locationString.includes(filters.location.toLowerCase())) {
            return false;
          }
        }
        
        // Filter by price range
        if (filters.minPrice && space.price < filters.minPrice) {
          return false;
        }
        
        if (filters.maxPrice && space.price > filters.maxPrice) {
          return false;
        }
        
        // Filter by date availability
        if (filters.startDate && filters.endDate) {
          // Check if there's any availability that includes the requested time range
          const requestStart = new Date(filters.startDate);
          const requestEnd = new Date(filters.endDate);
          
          return space.availability.some(slot => {
            const slotStart = new Date(slot.start);
            const slotEnd = new Date(slot.end);
            
            return slotStart <= requestStart && slotEnd >= requestEnd;
          });
        }
        
        return true;
      }) 
    : spaces;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredSpaces.map((space) => (
        <SpaceCard key={space._id} space={space} />
      ))}
      
      {filteredSpaces.length === 0 && (
        <div className="col-span-full py-12 text-center">
          <p className="text-lg text-gray-500">No spaces found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SpacesGrid;
