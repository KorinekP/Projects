import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthors } from './AuthorsContext';
import axios from 'axios';
import Modal from '../general/Modal';
function Authors() {
  const { authors, loading, error, fetchAuthors } = useAuthors();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : { role: 'none' };
  const userRole = user.role;
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [authorIdToDelete, setAuthorIdToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const handleDelete = async (authorId: number) => {
    setAuthorIdToDelete(authorId);
    setShowModal(true);
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  let sortedAuthors = [...authors];
  if (sortConfig.key) {
    sortedAuthors.sort((a, b) => {
      if (sortConfig.key === 'firstName') {
        return sortConfig.direction === 'ascending'
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName);
      } else if (sortConfig.key === 'bornDate') {
        const dateA = new Date(a.bornDate).getTime();
        const dateB = new Date(b.bornDate).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Authors</h2>
      {userRole === 'admin' && (
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          onClick={() => navigate('/addauthor')}
        >
          Add Author
        </button>
      )}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                Name{' '}
                {sortConfig.key === 'firstName' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('bornDate')}
              >
                Born Date{' '}
                {sortConfig.key === 'bornDate' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="border border-gray-300 px-4 py-2">Specializations</th>
              {userRole === 'admin' && <th className="border border-gray-300 px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedAuthors.map((author) => (
              <tr key={author.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/authors/${author.id}`);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {author.firstName} {author.lastName}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(author.bornDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{author.specializations.join(', ')}</td>
                {userRole === 'admin' && (<td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline"
                    onClick={() => handleDelete(author.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => navigate(`/authorform/${author.id}`)}
                  >
                    Edit
                  </button>
                </td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          title="event"
          onCancel={() => setShowModal(false)}
          onConfirm={async () => {
              await axios.delete(`http://localhost:3000/authors/${authorIdToDelete}`);
              setShowModal(false);
              fetchAuthors();
            }
          }
        />
      </div>
    </>
  );
}

export default Authors;
