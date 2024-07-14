// import { useBearStore } from "@/store";
import styles from "./index.module.less";
import welcome from "@/assets/welcome.png";

export default function Welcome() {
	return (
		<div className={styles.welcome}>
			<div className={styles.content}>
				<div className={styles.subTitle}>欢迎体验</div>
				<div className={styles.title}>A+ 物流后台管理系统</div>
				<div className={styles.techStack}>技术栈：React + ReactRouter + TypeScript + Zustand + Vite + Ant Design</div>
			</div>
			<img src={welcome} className={styles.welcomeImg} />
		</div>
	);
}
