
import React from 'react';
import type { Reservation } from '../../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { format } from 'date-fns';
import { Badge } from '../../ui/badge';
import { reservationsAPI } from '../../../services/api';
import { toast } from 'sonner';

interface DashboardReservationsProps {
  reservations: Reservation[];
  onStatusChange: (id: string, status: string) => void;
  onRefresh: () => void;
}

const DashboardReservations: React.FC<DashboardReservationsProps> = ({ 
  reservations, 
  onStatusChange,
  onRefresh
}) => {
  const handleStatusChange = async (id: string | undefined, status: string) => {
    if (!id) return;
    
    try {
      if (status === 'cancelled') {
        await reservationsAPI.cancel(id);
        toast.success('Reservation cancelled successfully');
      } else {
        // In a real app, we would have an API endpoint to change status to confirmed
        // For now, we'll just simulate it
        toast.success('Reservation status updated successfully');
      }
      
      onStatusChange(id, status);
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Reservations Management
        </h2>
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Space</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {typeof reservation.userId === 'object' 
                      ? reservation.userId.fullName 
                      : 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    {typeof reservation.spaceId === 'object' 
                      ? reservation.spaceId.title 
                      : 'Unknown Space'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(reservation.startDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(reservation.startDate), 'HH:mm')} - 
                    {format(new Date(reservation.endDate), 'HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={reservation.status === 'confirmed' ? 'secondary' : 'destructive'}>
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          className="px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      )}
                      {reservation.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                          className="px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No reservations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardReservations;
