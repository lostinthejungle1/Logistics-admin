import { Menu } from "antd";
import { DesktopOutlined, UsergroupAddOutlined, ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
	const navigate = useNavigate();
	const items = [
		{
			key: "1",
			label: "工作台",
			icon: <DesktopOutlined />,
		},
		{
			key: "2",
			label: "用户管理",
			icon: <UsergroupAddOutlined />,
			children: [
				{
					key: "2-1",
					label: "用户列表",
				},
				{
					key: "2-2",
					label: "菜单管理",
				},
				{
					key: "2-3",
					label: "角色管理",
				},
				{
					key: "2-4",
					label: "部门管理",
				},
			],
		},
		{
			key: "3",
			label: "订单管理",
			icon: <ShoppingCartOutlined />,
			children: [
				{
					key: "3-1",
					label: "订单列表",
				},
				{
					key: "3-2",
					label: "订单聚合",
				},
				{
					key: "3-3",
					label: "司机列表",
				},
			],
		},
	];
	return (
		<div>
			<div className={styles.logo} onClick={() => navigate("/welcome")}>
				<ThunderboltOutlined />
				A+ Logistics
			</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={items} />
		</div>
	);
};

export default SideMenu;
