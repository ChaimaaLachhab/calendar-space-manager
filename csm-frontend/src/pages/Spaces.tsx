
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { spacesAPI } from '../services/api';
import type { Space, SpaceFilters } from '../types';
import SpacesGrid from '../components/spaces/SpacesGrid';
import SpaceFiltersComponent from '../components/spaces/SpaceFilters';
import { toast } from 'sonner';

const Spaces: React.FC = () => {
  const [filters, setFilters] = useState<SpaceFilters>({});

  // Fetch spaces data
  const { 
    data: spaces, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      try {
        const response = await spacesAPI.getAll();
        return response.data;
      } catch (error) {
        toast.error('Failed to load spaces');
        throw error;
      }
    }
  });

  // Extract unique categories for filter dropdown
  const categories: string[] = useMemo(() => {
    if (!spaces) return [];
    const uniqueCategories = new Set<string>(spaces.map(space => space.category));
    return Array.from(uniqueCategories);
  }, [spaces]);
  

  // Handle filter change
  const handleFilterChange = (newFilters: SpaceFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Find the Perfect Space for Your Needs
          </h1>
          <p className="mt-3 text-xl text-blue-100">
            Browse our collection of spaces for work, meetings, and events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:grid md:grid-cols-12 md:gap-8">
          {/* Filters - Sidebar */}
          <div className="md:col-span-3">
            <SpaceFiltersComponent 
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>
          
          {/* Spaces Grid */}
          <div className="md:col-span-9">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">Failed to load spaces</p>
                  </div>
                </div>
              </div>
            ) : (
              <SpacesGrid spaces={spaces || []} filters={filters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spaces;
