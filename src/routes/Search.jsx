import { useState, useEffect } from 'react';
import { getUserCredentials } from './helpers/tokenManager';

import ImageList from './ImageList';
import Pagination from './Pagination';

export default function Search() {
  const [query, setQuery] = useState('');

  // manage pagination
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // set after recieving content from backend
  const [content, setContent] = useState([]);

  // manages content type radio buttons
  const [contentType, setContentType] = useState('image');

  // manages post-search message
  const [searchedQuery, setSearchedQuery] = useState('');
  const [searchedContentType, setSearchedContentType] = useState('');

  const handleContentTypeChange = (e) => {
    setContentType(() => e.target.value);
  };

  const clearSearch = () => {
    setSearchedQuery(() => '');
    setSearchedContentType(() => '');
    setContent(() => []);
    setPage(() => 1);
  };

  // toggles the favourite flag of te content
  const toggleContentStatus = (pixabayId) => {
    const index = content.findIndex((item) => item.pixabayId === pixabayId);

    const updatedItem = {
      ...content[index],
      favourite: content[index]?.favourite ? false : true
    };

    const updatedContent = [
      ...content.slice(0, index),
      updatedItem,
      ...content.slice(index + 1)
    ];

    setContent(() => updatedContent);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    getResults(query);
  };

  const getResults = async (queryParam = query, queryPage = page) => {
    // get token from storage
    const { token } = getUserCredentials();

    // add url parameters
    const url = `http://localhost:3000/api/v1/search?query=${queryParam}&contentType=${contentType}&page=${queryPage}`;

    // make req to server
    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      setPage(() => data.page);
      setTotalResults(() => data.totalHits);
      setSearchedQuery(() => queryParam);
      setQuery(() => '');
      setContent(() => data.content);
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join(', '));
    } else {
      alert('There was a problem fetching data. Please try again later.');
    }
  };

  const changePagination = (page) => getResults(searchedQuery, page);

  const queryMessage = (
    <p>
      {`Showing ${searchedContentType} results for "${searchedQuery}"`}
      <button onClick={clearSearch} style={{ marginLeft: '12px' }}>
        Clear
      </button>
    </p>
  );

  return (
    <>
      <form onSubmit={submitSearch}>
        <input
          type='query'
          placeholder='Search for content'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label style={{ marginLeft: '4px' }}>
          <input
            type='radio'
            value='image'
            checked={contentType === 'image'}
            onChange={handleContentTypeChange}
          />
          Images
        </label>
        <label>
          <input
            type='radio'
            value='video'
            checked={contentType === 'video'}
            onChange={handleContentTypeChange}
          />
          Videos
        </label>

        <button type='submit' style={{ marginLeft: '12px' }}>
          Search
        </button>
      </form>
      {content.length > 0 && (
        <>
          <p>{queryMessage}</p>
          <ImageList
            content={content}
            toggleContentStatus={toggleContentStatus}
            showRemove={false}
          />
          <Pagination
            page={page}
            totalResults={totalResults}
            changePage={changePagination}
          />
        </>
      )}
    </>
  );
}
