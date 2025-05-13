
import React from 'react';
import type { Space } from '../../../types';
import SpacesList from '../SpacesList';

interface DashboardSpacesProps {
  spaces: Space[];
  onDelete: (id: string) => void;
}

const DashboardSpaces: React.FC<DashboardSpacesProps> = ({ spaces, onDelete }) => {
  return <SpacesList spaces={spaces} onDelete={onDelete} />;
};

export default DashboardSpaces;
