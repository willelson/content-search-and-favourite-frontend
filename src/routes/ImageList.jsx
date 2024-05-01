import styles from './styles/ImageList.module.css';

export default function ImageList({ content }) {
  const thumnails = content.map((item) => (
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

  return <ul className={styles.gridContainer}>{thumnails}</ul>;
}
