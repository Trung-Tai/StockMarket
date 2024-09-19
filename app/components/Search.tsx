import React, { useState } from 'react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Tìm kiếm:', query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
        placeholder="Search..."
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Search
      </button>
    </form>
  );
};

export default Search;
