
import React from 'react';
import type { Contact } from '../../types';
import  { ContactStatus } from '../../types';
import { contactAPI } from '../../services/api';
import { toast } from 'sonner';

interface ContactsListProps {
  contacts: Contact[];
  onRespond: (id: string, response: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onRespond }) => {
  const handleRespondToMessage = async (id: string) => {
    const response = window.prompt('Enter your response:');
    
    if (response && id) {
      try {
        await contactAPI.respond(id, response);
        onRespond(id, response);
        toast.success('Response sent successfully');
      } catch (error) {
        toast.error('Failed to send response');
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-6">
        Contact Messages
      </h2>
      
      {/* Messages List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {contact.email}
                  </p>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === ContactStatus.Pending
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {contact.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {contact.message}
                </p>
              </div>
              
              {contact.response && (
                <div className="mt-3 bg-gray-50 p-3 rounded-md">
                  <h4 className="text-xs font-medium text-gray-500">Your response:</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {contact.response}
                  </p>
                </div>
              )}
              
              {contact.status === ContactStatus.Pending && (
                <div className="mt-3">
                  <button
                    onClick={() => handleRespondToMessage(contact.id || '')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Respond
                  </button>
                </div>
              )}
            </li>
          ))}
          
          {contacts.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center">
              <p className="text-sm text-gray-500">No messages found</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContactsList;
