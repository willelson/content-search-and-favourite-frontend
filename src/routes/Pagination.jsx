import styles from './styles/Pagination.module.css';

export default function Pagination({ page = 1, totalResults = 0, changePage }) {
  const resultsPerPage = 20;

  // TODO chack max page limit
  const nextDisabled = page * resultsPerPage >= totalResults;
  const prevDisabled = page === 1;

  const nextPage = () => {
    const nextPage = Number(page) + 1;
    changePage(nextPage);
  };

  const prevPage = () => {
    const prevPage = Number(page) - 1;
    changePage(prevPage);
  };

  return (
    <>
      <div className={styles.pagination}>
        <button disabled={prevDisabled} onClick={prevPage}>
          prev
        </button>
        <p>page {page}</p>
        <button disabled={nextDisabled} onClick={nextPage}>
          next
        </button>
      </div>
    </>
  );
}
