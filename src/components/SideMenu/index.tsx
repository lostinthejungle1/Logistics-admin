import { Menu } from "antd";
import * as AntIcons from "@ant-design/icons";
import { ThunderboltOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";
import { useBearStore } from "@/store";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import React from "react";
import { Menu as MenuType } from "@/types/api";

const SideMenu = () => {
	const navigate = useNavigate();
	const collapsed = useBearStore((state) => state.collapsed);
	const [logoText, setLogoText] = useState("");
	useEffect(() => {
		setLogoText(collapsed ? "" : "A+Logistics");
	}, [collapsed]);
	const data = useRouteLoaderData("layout") as { menuList: MenuType.MenuItem[] };
	type MenuItem = Required<MenuProps>["items"][number];
	const [items, setItems] = useState<MenuItem[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	const { pathname } = useLocation();
	useEffect(() => {
		if (data) {
			const menuData = getMenuTree(data.menuList);
			setItems(menuData);
			setSelectedKeys([pathname]);
		}
	}, [data]);
	const getItem = (label: React.ReactNode, key: React.Key, icon: React.ReactNode, children?: MenuItem[]): MenuItem => {
		return {
			label,
			key,
			icon,
			children,
		};
	};
	const getIcon = (name: string) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const icons: { [key: string]: any } = AntIcons;
		const icon = icons[name];
		if (icon) {
			// console.log("icon", icon);
			return React.createElement(icon);
		}
		return null;
	};

	const getMenuTree = (list: MenuType.MenuItem[], result: MenuItem[] = []): MenuItem[] => {
		list.forEach((item, index) => {
			if (item.menuType === 1 && item.menuState === 1) {
				const icon = getIcon(item.icon || "");
				if (item.buttons) {
					result.push(getItem(item.menuName, item.path || index, icon));
				} else {
					const children = item.children ? getMenuTree(item.children) : undefined;
					const menuItem = getItem(item.menuName, item._id, icon, children);
					result.push(menuItem);
				}
			}
		});
		return result;
	};
	return (
		<div>
			<div className={styles.logo} onClick={() => navigate("/welcome")}>
				<ThunderboltOutlined />
				<div className={styles.logoText}>{logoText}</div>
			</div>
			<Menu
				theme="dark"
				mode="inline"
				defaultSelectedKeys={["1"]}
				items={items}
				selectedKeys={selectedKeys}
				onClick={({ key }) => {
					// console.log("key", key);
					setSelectedKeys([key]);
					navigate(key);
				}}
			/>
		</div>
	);
};

export default SideMenu;
