import styles from "./index.module.less";
const Card = ({ label, data }: { label: string; data: string }) => {
	return (
		<div className={styles.card}>
			<div className={styles.label}>{label}</div>
			<div className={styles.data}>{data}</div>
		</div>
	);
};

export default Card;
