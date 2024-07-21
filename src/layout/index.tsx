import React, { useEffect } from "react";
import { Layout, Watermark } from "antd";
import { Navigate, Outlet, useLocation, useRouteLoaderData } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import SideMenu from "@/components/SideMenu";
import styles from "./index.module.less";
import api from "@/api";
import { useBearStore } from "@/store";
import { IAuthLoader } from "@/router/AuthLoader";

const { Content, Sider } = Layout;

const PageLayout = () => {
	const store = useBearStore();

	useEffect(() => {
		getUserInfo();
	}, []);
	const { pathname } = useLocation();
	const data = useRouteLoaderData("layout") as IAuthLoader;
	if (data.menuPathList.indexOf(pathname) === -1 && ["/welcome"].indexOf(pathname) === -1) {
		return <Navigate to="/403" />;
	}

	const getUserInfo = async () => {
		const data = await api.getUserInfo();
		store.updateUserInfo(data);
		// store.updateToken("test-token");
	};
	return (
		<Watermark content="test">
			<Layout>
				<Sider collapsed={store.collapsed}>
					<SideMenu />
				</Sider>
				<Layout>
					<NavHeader />
					<Content className={styles.content}>
						<div className={styles.wrapper}>
							<Outlet />
						</div>
						<NavFooter />
					</Content>
				</Layout>
			</Layout>
		</Watermark>
	);
};

export default PageLayout;
