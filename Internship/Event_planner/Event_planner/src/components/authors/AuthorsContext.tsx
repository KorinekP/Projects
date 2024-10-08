import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  bornDate: Date;
  specializations: string[];
}

interface AuthorsContextProps {
  authors: Author[];
  loading: boolean;
  error: string | null;
  fetchAuthors: () => void;
}

const AuthorsContext = createContext<AuthorsContextProps | undefined>(undefined);

const AuthorsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get<Author[]>('http://localhost:3000/authors');
      setAuthors(response.data);
      setLoading(false);
    } catch (error : any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <AuthorsContext.Provider value={{ authors, loading, error, fetchAuthors }}>
      {children}
    </AuthorsContext.Provider>
  );
};

const useAuthors = () => {
  const context = useContext(AuthorsContext);
  if (!context) {
    throw new Error('useAuthors must be used within an AuthorsProvider');
  }
  return context;
};

export { AuthorsProvider, useAuthors };
