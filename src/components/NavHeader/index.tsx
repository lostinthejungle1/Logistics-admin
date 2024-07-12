import { MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Dropdown, Switch } from "antd";
import type { MenuProps } from "antd";
import styles from "./index.module.less";
const NavHeader = () => {
	const breadcrumbList = [{ title: "首页" }, { title: "工作台" }];
	const items: MenuProps["items"] = [
		{ key: "1", label: "个人中心" },
		{ key: "2", label: "退出" },
	];
	return (
		<div className={styles.navHeader}>
			<div className={styles.left}>
				<MenuFoldOutlined />
				<Breadcrumb items={breadcrumbList} />
			</div>
			<div className={styles.right}>
				<Switch checkedChildren="暗黑" unCheckedChildren="默认" />
				<Dropdown menu={{ items }}>
					<span>Liang LIU</span>
				</Dropdown>
			</div>
		</div>
	);
};

export default NavHeader;
