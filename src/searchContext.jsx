import React, { useState } from 'react';

export const SearchContext = React.createContext();
export const SearchContextProvider = ({ children }) => {
  // Manages pagination
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [content, setContent] = useState([]);

  // Manages query parameters:
  //  - Display current query to user
  //  - Build query params to fetch content after pagination change
  const [query, setQuery] = useState('');
  const [contentTypeQuery, setContentTypeQuery] = useState('');

  const contextValue = {
    page,
    setPage,
    totalResults,
    setTotalResults,
    content,
    setContent,
    query,
    setQuery,
    contentTypeQuery,
    setContentTypeQuery
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
