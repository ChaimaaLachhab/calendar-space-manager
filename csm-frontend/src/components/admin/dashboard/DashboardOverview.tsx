
import React from 'react';
import type { Space, Contact } from '../../../types';
import DashboardStats from '../DashboardStats';

interface DashboardOverviewProps {
  spaces: Space[];
  contacts: Contact[];
  reservationsCount: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  spaces, 
  contacts, 
  reservationsCount 
}) => {
  // Calculate pending messages count
  const pendingMessagesCount = contacts?.filter(c => c.status === 'pending').length || 0;
  
  return (
    <div>
      {/* Stats Cards */}
      <DashboardStats 
        spacesCount={spaces?.length || 0}
        reservationsCount={reservationsCount}
        pendingMessagesCount={pendingMessagesCount}
      />
      
      {/* Recent Activities */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Recent Activity
        </h2>
        
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {spaces && spaces.length > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      Space Available
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Recent
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {spaces[0].title}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )}
            
            {contacts && contacts.length > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      New message received
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Recent
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        From: {contacts[0].name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )}
            
            {(!spaces || spaces.length === 0) && (!contacts || contacts.length === 0) && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <p className="text-sm text-gray-500 text-center">
                    No recent activity to display
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
