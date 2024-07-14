import { Menu } from "antd";
import {
	DesktopOutlined,
	UsergroupAddOutlined,
	ShoppingCartOutlined,
	ThunderboltOutlined,
	UserOutlined,
	MenuOutlined,
	TrademarkCircleOutlined,
	SendOutlined,
	BarsOutlined,
	DotChartOutlined,
	PayCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";
import { useBearStore } from "@/store";

const SideMenu = () => {
	const navigate = useNavigate();
	const collapsed = useBearStore((state) => state.collapsed);
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
					icon: <UserOutlined />,
				},
				{
					key: "2-2",
					label: "菜单管理",
					icon: <MenuOutlined />,
				},
				{
					key: "2-3",
					label: "角色管理",
					icon: <TrademarkCircleOutlined />,
				},
				{
					key: "2-4",
					label: "部门管理",
					icon: <SendOutlined />,
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
					icon: <BarsOutlined />,
				},
				{
					key: "3-2",
					label: "订单聚合",
					icon: <DotChartOutlined />,
				},
				{
					key: "3-3",
					label: "司机列表",
					icon: <PayCircleOutlined />,
				},
			],
		},
	];
	return (
		<div>
			<div className={styles.logo} onClick={() => navigate("/welcome")}>
				<ThunderboltOutlined />
				<div className={styles.logoText}>{collapsed ? "" : "A+ Logistics"}</div>
			</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={items} />
		</div>
	);
};

export default SideMenu;
