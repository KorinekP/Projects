import { NavLink, useNavigate } from 'react-router-dom';
function Sidebar() {
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : { role: 'none' };
  const { role } = user;

  return (
    <div className="bg-gray-800 h-screen w-[170px] fixed left-0 top-0">
      <nav className="mt-10">
        <ul>
          {role === 'none' && (
            <>
              <li className="mb-4">
                <NavLink
                  to="/login"
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Login
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/register"
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
          {role !== 'none' && (
            <>
              {role === 'admin' && (
                <li className="mb-4">
                  <NavLink
                    to="/users"
                    className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Users
                  </NavLink>
                </li>
              )}
              <li className="mb-4">
                <NavLink
                  to="/events"
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Events
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/authors"
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Authors
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/profile"
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Profile
                </NavLink>
              </li>
              <li className="mb-4">
                <button
                  onClick={handleLogout}
                  className="block text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
