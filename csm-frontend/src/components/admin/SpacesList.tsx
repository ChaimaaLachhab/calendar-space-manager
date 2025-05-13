
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Space } from '../../types';
import { spacesAPI } from '../../services/api';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface SpacesListProps {
  spaces: Space[];
  onDelete: (id: string) => void;
}

const SpacesList: React.FC<SpacesListProps> = ({ spaces, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await spacesAPI.delete(id);
        onDelete(id);
        toast.success('Space deleted successfully');
      } catch (error) {
        toast.error('Failed to delete space');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          All Spaces
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/spaces/new')}
        >
          Add New Space
        </button>
      </div>
      
      {/* Spaces List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {spaces.map((space) => (
            <li key={space._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={space.images.length > 0 ? space.images[0].mediaUrl : '/placeholder.svg'}
                        alt={space.title}
                      />
                    </div>
                    <div className="ml-4">
                    <Link
                    to={`/spaces/${space._id}`}
                    className="text-sm font-medium text-blue-600"
                  >
                    {space.title}
                  </Link>
                      
                      <div className="text-sm text-gray-500">
                        {space.category} • {space.location.city}, {space.location.country} • Capacity: {space.capacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      onClick={() => navigate(`/admin/spaces/${space._id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      onClick={() => handleDelete(space._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpacesList;
