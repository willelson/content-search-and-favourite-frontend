import { createContext, useState, ReactNode } from 'react';
import { PixabayItem } from '../types/pixabayTypes';

type SearchContext = {
  updateSearchContext: (
    data: PixabayData,
    query: string,
    contentType: string
  ) => void;
  clearSearch: () => void;
  removeContentFavourite: (pixabayId: number) => void;
  page: number;
  totalResults: number;
  content: PixabayItem[];
  query: string;
  contentTypeQuery: string;
};

type SearchContextProvider = {
  children: ReactNode;
};

type PixabayData = {
  page: number;
  totalHits: number;
  content: PixabayItem[];
};

export const SearchContext = createContext({} as SearchContext);

export const SearchContextProvider = ({ children }: SearchContextProvider) => {
  // Manages pagination
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Manages pixabay content from search results
  const [content, setContent] = useState<PixabayItem[]>([]);

  // Manages query parameters:
  //  - Display current query to user
  //  - Build query params to fetch content after pagination change
  const [query, setQuery] = useState<string>('');
  const [contentTypeQuery, setContentTypeQuery] = useState<string>('');

  /**
   * Reset all search state values to default
   */
  const clearSearch = () => {
    // Clear saved url parameter state
    setQuery(() => '');
    setContentTypeQuery(() => '');

    // Clear loaded content
    setContent(() => []);

    // Reset page back to 1
    setPage(() => 1);
  };

  /**
   * Add all necessary data from Pixabay response into the searchContext state
   */
  const updateSearchContext = (
    data: PixabayData,
    query: string,
    contentType: string
  ) => {
    // Add server response to local state
    setPage(() => data.page);
    setTotalResults(() => data.totalHits);
    setContent(() => data.content);

    // Store details about current search to display to user and use for pagination changes
    setQuery(() => query);
    setContentTypeQuery(() => contentType);
  };

  /**
   * Remove favourite, if it exists, from search results stored in context
   */
  const removeContentFavourite = (id: number) => {
    const updatedContent = content.map((item) => {
      const userFavouriteId =
        item.pixabayId === id ? null : item.userFavouriteId;
      return { ...item, userFavouriteId };
    });
    setContent(() => updatedContent);
  };

  const contextValue = {
    updateSearchContext,
    clearSearch,
    removeContentFavourite,
    page,
    totalResults,
    content,
    query,
    contentTypeQuery
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
