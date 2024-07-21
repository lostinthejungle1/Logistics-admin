import { IAuthLoader } from "@/router/AuthLoader";
import { useBearStore } from "@/store";
import { Button } from "antd";
import { useRouteLoaderData } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthButton = (props: any) => {
	const data = useRouteLoaderData("layout") as IAuthLoader;
	const userInfo = useBearStore((state) => state.userInfo);
	if ((props.auth && data.buttonList.includes(props.auth)) || userInfo.role === 1) {
		return <Button {...props}></Button>;
	} else {
		return null;
	}
};

export default AuthButton;
