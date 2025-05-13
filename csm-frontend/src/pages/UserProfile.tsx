
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, reservationsAPI } from '../services/api';
import type { Reservation } from '../types';
import { ReservationStatus } from '../types';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'reservations'>('profile');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  // Load user reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await reservationsAPI.getUserReservations();
        setReservations(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load your reservations');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setUpdateError(null);
    
    try {
      const updatedProfile: any = {
        fullName
      };
      
      // Only include password if it was provided
      if (password) {
        updatedProfile.password = password;
      }
      
      const response = await authAPI.updateProfile(updatedProfile);
      
      // Update local user state
      if (response.data.user) {
        updateUser(response.data.user);
      }
      
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reservation cancellation
  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    try {
      await reservationsAPI.cancel(reservationId);
      
      // Update reservations list
      setReservations(reservations.map(res => 
        res.id === reservationId ? { ...res, status: ReservationStatus.Cancelled } : res
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  // Mock reservations for development
  const mockReservations: Reservation[] = [
    {
      id: '1',
      userId: '1',
      spaceId: '1',
      startDate: new Date('2025-06-15T10:00:00'),
      endDate: new Date('2025-06-15T12:00:00'),
      status: ReservationStatus.Confirmed
    },
    {
      id: '2',
      userId: '1',
      spaceId: '2',
      startDate: new Date('2025-06-20T14:00:00'),
      endDate: new Date('2025-06-20T17:00:00'),
      status: ReservationStatus.Confirmed
    },
    {
      id: '3',
      userId: '1',
      spaceId: '1',
      startDate: new Date('2025-05-10T09:00:00'),
      endDate: new Date('2025-05-10T11:00:00'),
      status: ReservationStatus.Cancelled
    }
  ];

  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              My Account
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile and reservations
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-4 text-center text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`ml-8 px-4 py-4 text-center text-sm font-medium ${
                  activeTab === 'reservations'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reservations
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account information
                </p>
                
                {updateSuccess && (
                  <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Profile updated successfully
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {updateError && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{updateError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      className="mt-1 form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 form-input bg-gray-50 cursor-not-allowed"
                      value={email}
                      disabled
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="mt-1 form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  My Reservations
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your space reservations
                </p>
                
                {error && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {loading ? (
                  <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="mt-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Space
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {typeof reservation.spaceId === 'object' ? reservation.spaceId.title : `Space #${reservation.spaceId}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDateTime(reservation.startDate)} to {formatDateTime(reservation.endDate)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {reservation.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reservation.status === 'confirmed' && (
                                  <button
                                    onClick={() => reservation.id && handleCancelReservation(reservation.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="overflow-x-auto">
                    <p className="mt-1 text-sm text-gray-500"> No reservations exist</p>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => navigate('/spaces')}
                          className="btn btn-primary"
                        >
                          Browse Spaces
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
