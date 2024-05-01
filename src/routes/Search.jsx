import { useState, useEffect } from 'react';
import { getUserCredentials } from './helpers/tokenManager';

import styles from './styles/ImageList.module.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState('image');
  const [searchedContentType, setSearchedContentType] = useState('');

  const handleContentTypeChange = (e) => {
    setContentType(() => e.target.value);
  };

  const clearSearch = () => {
    setSearchedQuery(() => '');
    setSearchedContentType(() => '');
    setContent(() => []);
  };

  const search = async (e) => {
    e.preventDefault();

    // get token from storage
    const { token } = getUserCredentials();

    // add url parameters
    const url = `http://localhost:3000/api/v1/search?query=${query}&contentType=${contentType}`;

    // make req to server
    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      clearSearch();
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join(', '));
    } else {
      alert('There was a problem fetching data. Please try again later.');
    }
  };

  const queryMessage = content.length > 0 && (
    <p>
      {`Showing ${searchedContentType} results for "${searchedQuery}"`}
      <button onClick={clearSearch} style={{ marginLeft: '12px' }}>
        Clear
      </button>
    </p>
  );

  const results = content.map((item) => (
    <li key={item.id} style={{ padding: '10px' }}>
      <div>
        <img
          src={item.thumbnail}
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
      </div>
      <button>Add favourite!</button>
    </li>
  ));

  return (
    <>
      <form onSubmit={search}>
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
      <p>{queryMessage}</p>
      <ul className={styles.gridContainer}>{results}</ul>
    </>
  );
}
