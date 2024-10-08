import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Not Found",
    email: "Not Found",
    role: "Not Found",
    userId: "Not Found"
  });

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser({
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        userId: decodedToken.id
      });
    }
  }, [localStorage.getItem("token")]);

  const handleEdit = () => {
    if (user.userId) {
      navigate(`/userform/${user.userId}`);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-700 text-sm mb-2">Email: {user.email}</p>
        <p className="text-gray-700 text-sm mb-2">Role: {user.role}</p>
        <button 
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
