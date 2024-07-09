import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
export default function Forbidden() {
	const navigate = useNavigate();
	const goHome = () => {
		navigate("/");
	};
	return (
		<div>
			<Result
				status="403"
				title="403 NOT AUTHORIZED"
				subTitle="抱歉，您没有访问该页面的权限。"
				extra={
					<Button type="primary" onClick={goHome}>
						回到首页
					</Button>
				}
			/>
		</div>
	);
}
