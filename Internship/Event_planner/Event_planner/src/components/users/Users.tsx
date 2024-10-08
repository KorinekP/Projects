import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from './UsersContext';
import axios from 'axios';
import Modal from '../general/Modal';
function Users() {
  const { users, loading, error, fetchUsers } = useUsers();
  const [displayedUsers, setDisplayedUsers] = useState(users);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const navigate = useNavigate();
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  const handleDelete = async (userId: number) => {
    setUserIdToDelete(userId);
    setShowModal(true);
  };

  const handleFilterByRole = (role : string) => {
    const filteredUsers = users.filter((user) => user.role === role);
    setDisplayedUsers(filteredUsers);
  };

  const requestSort = (key : string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig.key !== '') {
      const sortedUsers = [...displayedUsers].sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'ascending'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortConfig.key === 'email') {
          return sortConfig.direction === 'ascending'
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        }
        return 0;
      });
      setDisplayedUsers(sortedUsers);
    }
  }, [sortConfig]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="flex mb-4">
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          onClick={() => navigate('/adduser')}
        >
          Add User
        </button>
        <div className="flex items-center">
          <span className="mr-2">Filter by role:</span>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => handleFilterByRole('admin')}
          >
            Admin
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => handleFilterByRole('user')}
          >
            User
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setDisplayedUsers(users)}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer w-[200px]"
                onClick={() => requestSort('name')}
              >
                Name{' '}
                {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer w-[700px]"
                onClick={() => requestSort('email')}
              >
                Email{' '}
                {sortConfig.key === 'email' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="border border-gray-300 px-4 py-2 w-[150px]">Role</th>
              <th className="border border-gray-300 px-4 py-2 w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2 h-[50px]">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/users/${user.id}`);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {user.name}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role === 'user' ? (
                    <>
                      <button
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigate(`/userform/${user.id}`)}
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    'Cannot edit other admins'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          title="event"
          onCancel={() => setShowModal(false)}
          onConfirm={async () => {
              await axios.delete(`http://localhost:3000/users/${userIdToDelete}`);
              setShowModal(false);
              fetchUsers();
            }
          }
        />
      </div>
    </>
  );
}

export default Users;
