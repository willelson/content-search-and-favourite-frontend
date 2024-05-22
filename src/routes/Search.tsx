import { useState, useContext, FormEvent } from 'react';

import { getUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';

import {
  Button,
  Container,
  Flex,
  Group,
  Text,
  Pagination,
  Input,
  Radio
} from '@mantine/core';
import ImageList from '../utils/ImageList';

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

  const resultsPerPage = 20;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  /**
   * Pagination page change handler. Passes query state from previous requests to getResults
   */
  const changePage = (newPage: number) =>
    getResults(query, contentTypeQuery, newPage);

  const queryMessage = (
    <Flex gap='md' align='center' mt='sm' mb='sm'>
      <Text>
        Showing {contentTypeQuery} results for "{query}"
      </Text>
      <Button size='xs' variant='default' onClick={clearSearch}>
        Clear
      </Button>
    </Flex>
  );

  // Show no results message if query set but content is empty
  const noSearchResults = query.length > 0 && content.length === 0 && (
    <Text>No results</Text>
  );

  return (
    <>
      <Container fluid mb='lg'>
        <form onSubmit={submitSearch}>
          <Group>
            <Input
              placeholder='Search Content'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Radio
              label='Image'
              value='image'
              checked={contentTypeInput === 'image'}
              onChange={(e) => setContentTypeInput(e.target.value)}
            />
            <Radio
              label='Video'
              value='video'
              checked={contentTypeInput === 'video'}
              onChange={(e) => setContentTypeInput(e.target.value)}
            />
            <Button size='xs' type='submit' disabled={searchInput.length === 0}>
              Search
            </Button>
          </Group>
        </form>
      </Container>
      {content.length > 0 && (
        <>
          <Container fluid>
            {queryMessage}

            <ImageList
              content={content}
              toggleContentStatus={toggleContentStatus}
            />
            <Flex justify='center' mt='md'>
              <Pagination
                value={page}
                total={totalPages}
                onChange={changePage}
              />
            </Flex>
          </Container>
        </>
      )}
      {noSearchResults}
    </>
  );
}
