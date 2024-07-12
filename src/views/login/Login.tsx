import styles from "./index.module.less";
import { Button, Form, Input, App } from "antd";
import api from "@/api/index";
import { login } from "@/types/api";
import storage from "@/utils/storage";
import { useState } from "react";
export default function Login() {
	const { message } = App.useApp();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: login.params) => {
		setLoading(true);
		const data = await api.login(values);
		setLoading(false);
		storage.set("token", data);
		message.success("登录成功");
		const params = new URLSearchParams(location.search);
		location.href = params.get("callback") || "/";
	};
	return (
		<div className={styles.login}>
			<div className={styles.loginWrapper}>
				<div className={styles.title}>系统登录</div>
				<Form name="basic" onFinish={onFinish} autoComplete="off">
					<Form.Item name="userName" rules={[{ required: true, message: "请输入用户名!" }]}>
						<Input />
					</Form.Item>

					<Form.Item name="userPwd" rules={[{ required: true, message: "请输入密码!" }]}>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button type="primary" block htmlType="submit" loading={loading}>
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}
