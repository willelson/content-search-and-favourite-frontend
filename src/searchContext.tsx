import React, { createContext, useState, ReactNode } from 'react';
import { PixabayItem } from './types/pixabayTypes';

type SearchContextType = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalResults: number;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
  content: PixabayItem[];
  setContent: React.Dispatch<React.SetStateAction<PixabayItem[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  contentTypeQuery: string;
  setContentTypeQuery: React.Dispatch<React.SetStateAction<string>>;
};

type SearchContextProvider = {
  children: ReactNode;
};

export const SearchContext = createContext({} as SearchContextType);

export const SearchContextProvider = ({ children }: SearchContextProvider) => {
  // Manages pagination
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [content, setContent] = useState<PixabayItem[]>([]);

  // Manages query parameters:
  //  - Display current query to user
  //  - Build query params to fetch content after pagination change
  const [query, setQuery] = useState<string>('');
  const [contentTypeQuery, setContentTypeQuery] = useState<string>('');

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
