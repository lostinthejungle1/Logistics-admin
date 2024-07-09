import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
	const navigate = useNavigate();
	const goHome = () => {
		navigate("/");
	};
	return (
		<div>
			<Result
				status="404"
				title="404 NOT FOUND"
				subTitle="抱歉，您访问的页面不存在。"
				extra={
					<Button type="primary" onClick={goHome}>
						回到首页
					</Button>
				}
			/>
		</div>
	);
}
