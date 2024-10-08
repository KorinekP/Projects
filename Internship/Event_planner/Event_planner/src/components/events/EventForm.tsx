import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthors } from '../authors/AuthorsContext';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authors, fetchAuthors } = useAuthors();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateFrom: '',
    dateTo: '',
    authors: [] as number[],
    createdBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userdata = token ? JSON.parse(atob(token.split('.')[1])) : { role: 'none' };
  const user = userdata.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchAuthors();
        if (id) {
          const response = await axios.get(`http://localhost:3000/events/${id}`);
          const event = response.data;
          setFormData({
            name: event.name,
            description: event.description,
            dateFrom: new Date(event.dateFrom).toISOString().split('T')[0],
            dateTo: new Date(event.dateTo).toISOString().split('T')[0], 
            authors: event.authors.map((author: { id: number }) => author.id),
            createdBy: event.createdBy 
          });
        }
      } catch (error  : any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAuthorAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const authorId = parseInt(e.target.value);
    if (!formData.authors.includes(authorId)) {
      setFormData(prevState => ({
        ...prevState,
        authors: [...prevState.authors, authorId],
      }));
    }
  };

  const handleAuthorRemove = (authorId: number) => {
    setFormData(prevState => ({
      ...prevState,
      authors: prevState.authors.filter(id => id !== authorId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    formData.createdBy = user;
    console.log(formData);
    try {
      if (id) {
        await axios.put(`http://localhost:3000/events/${id}`, formData);
      } else {
        await axios.post('http://localhost:3000/events', formData);
      }
      setLoading(false);
      navigate('/events');
    } catch (error : any) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      <h2 className="text-center text-2xl font-bold mb-6">Event Form</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date From:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date To:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Authors:
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="authors"
            onChange={handleAuthorAdd}>
            <option value="">Select an author</option>
            {authors
              .filter(author => !formData.authors.includes(author.id))
              .map(author => (
                <option key={author.id} value={author.id}>
                  {author.firstName} {author.lastName}
                </option>
              ))}
          </select>
        </label>
        <div>
          {formData.authors.map(authorId => {
            const author = authors.find(author => author.id === authorId);
            return (
              <div key={authorId}>
                {author ? `${author.firstName} ${author.lastName}` : 'Unknown Author'}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold ml-1 my-1 py-0 px-1 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => handleAuthorRemove(authorId)}>
                  X
                </button>
              </div>
            );
          })}
        </div>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          {id ? 'Update' : 'Add'} Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
