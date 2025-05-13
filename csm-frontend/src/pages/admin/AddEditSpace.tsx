
import React from 'react';
import SpaceForm from '../../components/admin/SpaceForm';

const AddEditSpace: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SpaceForm />
      </div>
    </div>
  );
};

export default AddEditSpace;
