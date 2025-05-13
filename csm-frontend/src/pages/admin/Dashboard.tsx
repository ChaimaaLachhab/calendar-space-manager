
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { spacesAPI, contactAPI, reservationsAPI } from '../../services/api';
import { UserRole } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Import our tab components
import DashboardOverview from '../../components/admin/dashboard/DashboardOverview';
import DashboardSpaces from '../../components/admin/dashboard/DashboardSpaces';
import DashboardMessages from '../../components/admin/dashboard/DashboardMessages';
import DashboardReservations from '../../components/admin/dashboard/DashboardReservations';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'spaces' | 'messages' | 'reservations'>('overview');
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    } 
    
    if (user && user.role !== UserRole.Admin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch spaces data
  const { 
    data: spaces,
    isLoading: spacesLoading,
    error: spacesError,
    refetch: refetchSpaces
  } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const response = await spacesAPI.getAll();
      return response.data;
    },
    enabled: isAuthenticated && user?.role === UserRole.Admin,
  });

  // Fetch contacts data
  const { 
    data: contacts,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await contactAPI.getAll();
      return response.data;
    },
    enabled: isAuthenticated && user?.role === UserRole.Admin && 
             (activeTab === 'overview' || activeTab === 'messages'),
  });

  // Fetch reservations data
  const {
    data: reservations,
    isLoading: reservationsLoading,
    error: reservationsError,
    refetch: refetchReservations
  } = useQuery({
    queryKey: ['reservations', 'admin'],
    queryFn: async () => {
      try {
        const response = await reservationsAPI.getAll();
        return response.data;
      } catch (error) {
        toast.error('Failed to load reservations');
        throw error;
      }
    },
    enabled: isAuthenticated && user?.role === UserRole.Admin && 
             (activeTab === 'overview' || activeTab === 'reservations'),
  });

  // Handle message response
  const handleRespondToMessage = async (id: string, response: string) => {
    refetchContacts();
  };

  // Handle space deletion
  const handleDeleteSpace = async (id: string) => {
    refetchSpaces();
  };

  // Handle reservation status change
  const handleReservationStatusChange = async (id: string, status: string) => {
    refetchReservations();
  };

  const isLoading = spacesLoading || 
                    (contactsLoading && (activeTab === 'overview' || activeTab === 'messages')) ||
                    (reservationsLoading && (activeTab === 'overview' || activeTab === 'reservations'));
  
  const error = spacesError || 
                (contactsError && (activeTab === 'overview' || activeTab === 'messages')) ||
                (reservationsError && (activeTab === 'overview' || activeTab === 'reservations'));

  if (!isAuthenticated || (user && user.role !== UserRole.Admin)) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage spaces, reservations, and messages
          </p>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('spaces')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'spaces'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Spaces
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reservations
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
            </button>
          </nav>
        </div>
        
        {/* Dashboard Content */}
        <div className="py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">Failed to load data</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Render the active tab component */}
              {activeTab === 'overview' && (
                <DashboardOverview 
                  spaces={spaces || []} 
                  contacts={contacts || []} 
                  reservationsCount={12} // In a real app, we would fetch this
                />
              )}
              
              {activeTab === 'spaces' && (
                <DashboardSpaces 
                  spaces={spaces || []} 
                  onDelete={handleDeleteSpace} 
                />
              )}

{activeTab === 'reservations' && (
                <DashboardReservations 
                  reservations={reservations || []} 
                  onStatusChange={handleReservationStatusChange} 
                  onRefresh={refetchReservations}
                />
              )}
              
              {activeTab === 'messages' && (
                <DashboardMessages 
                  contacts={contacts || []} 
                  onRespond={handleRespondToMessage} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
