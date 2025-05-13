
import React from 'react';
import type { Contact } from '../../../types';
import ContactsList from '../ContactsList';

interface DashboardMessagesProps {
  contacts: Contact[];
  onRespond: (id: string, response: string) => void;
}

const DashboardMessages: React.FC<DashboardMessagesProps> = ({ 
  contacts, 
  onRespond 
}) => {
  return <ContactsList contacts={contacts} onRespond={onRespond} />;
};

export default DashboardMessages;
