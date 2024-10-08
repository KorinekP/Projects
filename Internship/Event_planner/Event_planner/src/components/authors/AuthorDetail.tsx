import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthors } from './AuthorsContext';

interface Event {
  id: number;
  name: string;
  dateFrom: Date;
  dateTo: Date;
}

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authors } = useAuthors();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const author = authors.find(a => a.id === Number(id));

  useEffect(() => {
    if (author) {
      axios.get(`http://localhost:3000/authors/${author.id}/events`)
        .then(response => {
          setEvents(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [author, id]);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4">Error: {error}</div>;
  }

  if (!author) {
    return <div className="text-center mt-4">Author not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 px-4 py-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{author.firstName} {author.lastName}</h2>
      <p className="text-gray-700 mb-2">{author.description}</p>
      <p className="text-gray-700 mb-2">Born: {new Date(author.bornDate).toLocaleDateString()}</p>
      <h3 className="text-lg font-bold mb-2">Specializations</h3>
      <ul className="list-disc list-inside mb-4">
        {author.specializations.map((spec, index) => (
          <li key={index} className="text-gray-700">{spec}</li>
        ))}
      </ul>
      <h3 className="text-lg font-bold mb-2">Events</h3>
      {events.length > 0 ? (
        <ul className="list-disc list-inside mb-4">
          {events.map(event => (
            <li key={event.id} className="text-gray-700">{event.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No events found for this author.</p>
      )}
    </div>
  );
};

export default AuthorDetail;
