import styles from "./index.module.less";

const NavFooter = () => {
	return (
		<div className={styles.navFooter}>
			<div className={styles.links}>
				<a href="">Github Page</a>
				<span>|</span>
				<a href="">Portfolio Website</a>
				<span>|</span>
				<a href="">About this project</a>
			</div>
			<div>Copyright ©{new Date().getFullYear()} All Rights Reserved.</div>
		</div>
	);
};

export default NavFooter;
