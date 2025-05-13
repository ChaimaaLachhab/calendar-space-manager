
import React, { useState } from 'react';
import type { SpaceFilters, Category } from '../../types';
import { Filter, X } from 'lucide-react';

interface SpaceFiltersProps {
  onFilterChange: (filters: SpaceFilters) => void;
  categories: string[];
}

const SpaceFiltersComponent: React.FC<SpaceFiltersProps> = ({ onFilterChange, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SpaceFilters>({});

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Convert values to the right type
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value ? Number(value) : undefined;
    } else if (type === 'date') {
      parsedValue = value ? new Date(value) : undefined;
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="mb-8">
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border rounded-md shadow-sm"
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </span>
          {Object.keys(filters).length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {Object.keys(filters).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter form */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-white p-4 rounded-md shadow-sm border`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Filters</h3>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category || ''}
              onChange={handleFilterChange}
              className="form-input mt-1 w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location || ''}
              onChange={handleFilterChange}
              placeholder="Any location"
              className="form-input mt-1 w-full"
            />
          </div>

          {/* Capacity Filter */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Minimum Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={filters.capacity || ''}
              onChange={handleFilterChange}
              min="1"
              placeholder="Any capacity"
              className="form-input mt-1 w-full"
            />
          </div>

          {/* Price Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Min Price (€)
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleFilterChange}
                min="0"
                placeholder="Min"
                className="form-input mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Max Price (€)
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleFilterChange}
                min="0"
                placeholder="Max"
                className="form-input mt-1 w-full"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
                onChange={handleFilterChange}
                className="form-input mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
                onChange={handleFilterChange}
                className="form-input mt-1 w-full"
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpaceFiltersComponent;
