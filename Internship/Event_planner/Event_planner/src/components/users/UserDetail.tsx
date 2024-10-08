import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center mt-4">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-4 px-4 py-6 bg-white shadow rounded-lg">
      {user && (
        <>
          <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
          <p className="text-gray-700 mb-2">Email: {user.email}</p>
          <p className="text-gray-700 mb-2">Role: {user.role}</p>
        </>
      )}
    </div>
  );
};

export default UserDetail;
