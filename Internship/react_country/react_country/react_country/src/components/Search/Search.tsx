import React from 'react';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

function Search({ searchTerm, setSearchTerm }: SearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <input
      className="input input__search"
      type="text"
      placeholder="Search for a country..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
}

export default Search;
