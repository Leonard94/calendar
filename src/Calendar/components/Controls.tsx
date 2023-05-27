import styles from './styles.module.scss'

type TProps = {
  prev: () => void
  next: () => void
  current: string
}

export const Controls: React.FC<TProps> = ({ prev, next, current }) => {
  return (
    <div className={styles.controls}>
      <button onClick={prev}>назад</button>
      <div className={styles.current}>{current}</div>
      <button onClick={next}>вперед</button>
    </div>
  )
}
