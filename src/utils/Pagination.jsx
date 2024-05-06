import PropTypes from 'prop-types';

import styles from '../styles/Pagination.module.css';

export default function Pagination({ page = 1, totalResults = 0, changePage }) {
  const resultsPerPage = 20;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const nextDisabled = page * resultsPerPage >= totalResults;
  const prevDisabled = page == 1;

  const nextPage = () => changePage(page + 1);
  const prevPage = () => changePage(page - 1);

  return (
    <>
      <div className={styles.pagination}>
        <button disabled={prevDisabled} onClick={prevPage}>
          prev
        </button>
        <p>
          page {page} of {totalPages}
        </p>
        <button disabled={nextDisabled} onClick={nextPage}>
          next
        </button>
      </div>
    </>
  );
}

Pagination.propTypes = {
  page: PropTypes.number,
  totalResults: PropTypes.number,
  changePage: PropTypes.func
};
