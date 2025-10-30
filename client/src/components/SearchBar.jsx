import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search posts..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        <button type="submit" className="btn btn-primary search-button">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;