import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UsersContextProps {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (sortBy?: string, sortOrder?: 'ASC' | 'DESC', role?: string) => void;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC', role?: string) => {
    try {
      let query = `http://localhost:3000/users?sortOrder=${sortOrder}`;
      if (sortBy) query += `&sortBy=${sortBy}`;
      if (role) query += `&role=${role}`;

      const response = await axios.get<User[]>(query);
      setUsers(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export { UsersProvider, useUsers };
