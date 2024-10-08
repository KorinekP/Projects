import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthors } from './AuthorsContext';

interface AuthorFormProps {
  id?: number; 
}

const AuthorForm: React.FC<AuthorFormProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAuthors } = useAuthors();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    description: '',
    bornDate: '',
    specializations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:3000/authors/${id}`)
        .then(response => {
          const author = response.data;
  
          const date = new Date(author.bornDate);
          date.setDate(date.getDate() + 1);
          const formattedDate = date.toISOString().split('T')[0];
  
          setFormData({
            firstName: author.firstName,
            lastName: author.lastName,
            description: author.description,
            bornDate: formattedDate,
            specializations: author.specializations.join(', '),
          });
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      ...formData,
      specializations: formData.specializations.split(',').map(spec => spec.trim()),
    };

    const request = id
      ? axios.put(`http://localhost:3000/authors/${id}`, formattedData)
      : axios.post('http://localhost:3000/authors', formattedData);

    request
      .then(() => {
        fetchAuthors();
        setLoading(false);
        navigate('/authors');
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      <h2 className="text-center text-2xl font-bold mb-6">Author Form</h2>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="Enter author's first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Enter author's last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 resize-none text-gray-700 leading-tight resize:none focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter author's description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bornDate">
            Born Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bornDate"
            type="date"
            placeholder="Enter author's born date"
            name="bornDate"
            value={formData.bornDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specializations">
            Specializations (comma-separated)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="specializations"
            type="text"
            placeholder="e.g. Javascript, React"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {id ? 'Update' : 'Add'} Author
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorForm;
