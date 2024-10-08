import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../users/UsersContext';
interface Event {
  id: number;
  name: string;
  dateFrom: Date;
  dateTo: Date;
  description: string;
  createdBy: User;
}

interface EventsContextProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => void;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    axios.get<Event[]>('http://localhost:3000/events')
      .then(response => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, error, fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export { EventsProvider, useEvents };
