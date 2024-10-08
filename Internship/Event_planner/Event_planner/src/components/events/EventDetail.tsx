import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEvents } from './EventsContext';

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const event = events.find(e => e.id === Number(id));
  useEffect(() => {
    if (event) {
      axios.get(`http://localhost:3000/events/${event.id}/authors`)
        .then(response => {
          setAuthors(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [event, id]);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4">Error: {error}</div>;
  }

  if (!event) {
    return <div className="text-center mt-4">Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 px-4 py-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
      <p className="text-gray-700 mb-2">From: {new Date(event.dateFrom).toLocaleDateString()}</p>
      <p className="text-gray-700 mb-2">To: {new Date(event.dateTo).toLocaleDateString()}</p>
      <p className="text-gray-700 mb-2">Description: {event.description}</p>
      <p className="text-gray-700 mb-2">Created by: {event.createdBy ? event.createdBy.name : 'Unknown'}</p>
      <h3 className="text-lg font-bold mb-2">Authors</h3>
      {authors.length > 0 ? (
        <ul className="list-disc list-inside mb-4">
          {authors.map(author => (
            <li key={author.id} className="text-gray-700">{author.firstName} {author.lastName}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No authors found for this event.</p>
      )}
    </div>
  );
};

export default EventDetail;
