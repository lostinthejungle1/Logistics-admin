import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Dropdown, Switch } from "antd";
import type { MenuProps } from "antd";
import styles from "./index.module.less";
import { useBearStore } from "@/store";
const NavHeader = () => {
	const store = useBearStore();
	const breadcrumbList = [{ title: "首页" }, { title: "工作台" }];
	const items: MenuProps["items"] = [
		{ key: "1", label: "个人中心" },
		{ key: "2", label: "邮箱:" + store.userInfo.userEmail, disabled: true },
		{ key: "3", label: "退出" + store.token },
	];

	return (
		<div className={styles.navHeader}>
			<div className={styles.left}>
				<div onClick={() => store.toggleCollapsed()}>
					{store.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				</div>
				<Breadcrumb items={breadcrumbList} />
			</div>
			<div className={styles.right}>
				<Switch checkedChildren="暗黑" unCheckedChildren="默认" />
				<Dropdown menu={{ items }}>
					<span>{store.userInfo.userName}</span>
				</Dropdown>
			</div>
		</div>
	);
};

export default NavHeader;
