import { useState, useContext, FormEvent } from 'react';

import styles from '../styles/Search.module.css';
import { getUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';

import ImageList from '../utils/ImageList';
import Pagination from '../utils/Pagination';

import { SearchContext } from '../context/searchContext';

export default function Search() {
  // Search form state - used to build query params after submission
  const [searchInput, setSearchInput] = useState('');
  const [contentTypeInput, setContentTypeInput] = useState('image');

  const {
    updateSearchContext,
    clearSearch,
    page,
    totalResults,
    content,
    query,
    contentTypeQuery
  } = useContext(SearchContext);

  /**
   * Refresh search results after user adds an item to favourites
   */
  const toggleContentStatus = () => {
    getResults(query, contentTypeQuery, page);
  };

  /**
   * Prevent page refresh and pass form values to getResults
   */
  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstPage = 1;
    getResults(searchInput, contentTypeInput, firstPage);
  };

  /**
   * queryParam, contentTypeParam, queryPage are the values used to build the query:
   *  - when submitting the form these come from form state - searchInput, contentTypeInput
   *  - when calling from page change handler they come from search context state
   */
  const getResults = async (
    queryParam: string,
    contentTypeParam: string,
    queryPage: number
  ) => {
    const { token } = getUserCredentials();

    // Add url parameters to search
    const url = `${API_BASE}/search?query=${queryParam}&contentType=${contentTypeParam}&page=${queryPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      updateSearchContext(data, queryParam, contentTypeParam);

      // Clear search input
      setSearchInput(() => '');
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert('There was a problem fetching data. Please try again later.');
    }
  };

  /**
   * Pagination page change handler. Passes query state from previous requests to getResults
   */
  const changePage = (newPage: number) =>
    getResults(query, contentTypeQuery, newPage);

  const queryMessage = (
    <p>
      {`Showing ${contentTypeQuery} results for "${query}"`}
      <button onClick={clearSearch} style={{ marginLeft: '12px' }}>
        Clear
      </button>
    </p>
  );

  // Show no results message if query set but content is empty
  const noSearchResults = query.length > 0 && content.length === 0 && (
    <p>No results</p>
  );

  return (
    <>
      <form onSubmit={submitSearch}>
        <input
          type='text'
          placeholder='Search for content'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <label className={styles.label}>
          <input
            type='radio'
            value='image'
            checked={contentTypeInput === 'image'}
            onChange={(e) => setContentTypeInput(e.target.value)}
            className={styles.radioButton}
          />
          Images
        </label>
        <label className={styles.label}>
          <input
            type='radio'
            value='video'
            checked={contentTypeInput === 'video'}
            onChange={(e) => setContentTypeInput(e.target.value)}
            className={styles.radioButton}
          />
          Videos
        </label>

        <button
          type='submit'
          className={styles.searchButton}
          disabled={searchInput.length === 0}
          title={searchInput.length === 0 ? 'Enter search term' : ''}
        >
          Search
        </button>
      </form>
      {content.length > 0 && (
        <>
          <span>{queryMessage}</span>
          <ImageList
            content={content}
            toggleContentStatus={toggleContentStatus}
          />
          <Pagination
            page={page}
            totalResults={totalResults}
            changePage={changePage}
          />
        </>
      )}
      {noSearchResults}
    </>
  );
}
