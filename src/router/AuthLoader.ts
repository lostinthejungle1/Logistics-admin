import api from "@/api";
import { Menu } from "@/types/api";
import { getMenuPath } from "@/utils";

export interface IAuthLoader {
	buttonList: string[];
	menuList: Menu.MenuItem[];
	menuPathList: string[];
}

const AuthLoader = async () => {
	const data = await api.getPermissionList();
	const menuPathList = getMenuPath(data.menuList);
	return {
		buttonList: data.buttonList,
		menuList: data.menuList,
		menuPathList: menuPathList,
	};
};
export default AuthLoader;
