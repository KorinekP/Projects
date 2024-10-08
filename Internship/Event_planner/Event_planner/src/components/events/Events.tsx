import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEvents } from './EventsContext';
import Modal from '../general/Modal';
interface Event {
  id: number;
  name: string;
  dateFrom: Date;
  dateTo: Date;
  description: string;
}

interface EventReaction {
  likes: number;
  dislikes: number;
  status: boolean;
}

function Events() {
  const { events, loading, error, fetchEvents } = useEvents();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : { role: 'none' };
  const userRole = user.role;
  const userId = user.id;
  const [eventReactions, setEventReactions] = useState<{ [key: number]: EventReaction }>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: '', direction: '' });
  const [eventIdToDelete, setEventIdToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fetchReactions = async () => {
    const reactions: { [key: number]: EventReaction } = {};
    for (const event of events) {
      try {
        const [likesResponse, dislikesResponse, status] = await Promise.all([
          axios.get<number>(`http://localhost:3000/reactions/${event.id}/likes`),
          axios.get<number>(`http://localhost:3000/reactions/${event.id}/dislikes`),
          axios.get<boolean>(`http://localhost:3000/reactions/${userId}/status/${event.id}`),
        ]);
        reactions[event.id] = {
          likes: likesResponse.data,
          dislikes: dislikesResponse.data,
          status: status.data,
        };
      } catch (error) {
        console.error(`Error fetching reactions for event ${event.id}:`, error);
      }
    }
    setEventReactions(reactions);
  };

  useEffect(() => {
    fetchReactions();
  }, [events]);

  const handleDelete = async (eventId: number) => {
    setEventIdToDelete(eventId);
    setShowModal(true);
  };

  const handleLike = async (eventId: number) => {
    try {
      await axios.put(`http://localhost:3000/reactions/${userId}/like/${eventId}`);
    } catch (error) {
      console.error('Error liking event:', error);
    } finally {
      fetchReactions();
    }
  };

  const handleDislike = async (eventId: number) => {
    try {
      await axios.put(`http://localhost:3000/reactions/${userId}/dislike/${eventId}`);
    } catch (error) {
      console.error('Error disliking event:', error);
    } finally {
      fetchReactions();
    }
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

  let sortedEvents = [...events];
  if (sortConfig.key) {
    sortedEvents.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'ascending'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortConfig.key === 'dateFrom') {
        const dateA = new Date(a.dateFrom).getTime();
        const dateB = new Date(b.dateFrom).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === 'dateTo') {
        const dateA = new Date(a.dateTo).getTime();
        const dateB = new Date(b.dateTo).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === 'likes') {
        return sortConfig.direction === 'ascending'
          ? eventReactions[a.id]?.likes - eventReactions[b.id]?.likes
          : eventReactions[b.id]?.likes - eventReactions[a.id]?.likes;
      } else if (sortConfig.key === 'dislikes') {
        return sortConfig.direction === 'ascending'
          ? eventReactions[a.id]?.dislikes - eventReactions[b.id]?.dislikes
          : eventReactions[b.id]?.dislikes - eventReactions[a.id]?.dislikes;
      }
      return 0;
    });
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      {userRole === 'admin' && (
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          onClick={() => navigate('/addevent')}
        >
          Add Event
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Title{' '}
                {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('dateFrom')}
              >
                Begin date{' '}
                {sortConfig.key === 'dateFrom' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('dateTo')}
              >
                End date{' '}
                {sortConfig.key === 'dateTo' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('likes')}
              >
                Likes{' '}
                {sortConfig.key === 'likes' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('dislikes')}
              >
                Dislikes{' '}
                {sortConfig.key === 'dislikes' && (
                  <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                )}
              </th>
              {userRole === 'admin' && <th className="border border-gray-300 px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event: Event) => (
              <tr key={event.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/events/${event.id}`);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {event.name}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(event.dateFrom).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(event.dateTo).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ${eventReactions[event.id]?.status && 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => handleLike(event.id)}
                    disabled={eventReactions[event.id]?.status}
                  >
                    Like
                  </button>{' '}
                  {eventReactions[event.id]?.likes}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ${eventReactions[event.id] && eventReactions[event.id].status === false && 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => handleDislike(event.id)}
                    disabled={eventReactions[event.id] && eventReactions[event.id].status === false}
                  >
                    Dislike
                  </button>{' '}
                  {eventReactions[event.id]?.dislikes}
                </td>
                {userRole === 'admin' && (
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => navigate(`/eventform/${event.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          title="event"
          onCancel={() => setShowModal(false)}
          onConfirm={async () => {
              await axios.delete(`http://localhost:3000/events/${eventIdToDelete}`);
              setShowModal(false);
              fetchEvents();
            }
          }
        />

      </div>
    </>
  );
}

export default Events;
