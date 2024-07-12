import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider } from "antd";

function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					// Seed Token，影响范围大
					colorPrimary: "#ed6c00",
					borderRadius: 2,

					// 派生变量，影响范围小
					// colorBgContainer: "#f6f5ed",
				},
			}}
		>
			<RouterProvider router={router} />
		</ConfigProvider>
	);
}

export default App;
