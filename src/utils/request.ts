import axios from "axios";
// import { message } from "antd";
import { closeLoading, showLoading } from "./loading";
import { Result } from "@/types/api";
import storage from "./storage";
import { message } from "./AntdGlobal";

// Create an axios instance
const instance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 8000, // request timeout
	timeoutErrorMessage: "请求超时，请稍后重试",
	withCredentials: true,
});

//create request interceptor - add auth token
instance.interceptors.request.use(
	(config) => {
		if (config.showLoading) {
			showLoading();
		}
		// showLoading();
		const token = storage.get("token");
		config.headers.icode = "23B3904E1E8DE5DC";
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		if (!import.meta.env.VITE_MOCK) {
			config.baseURL = import.meta.env.VITE_MOCK_API;
		}
		return config;
	},
	(error) => Promise.reject(error.message)
);

//create response interceptor - handle response error
instance.interceptors.response.use(
	(response) => {
		// console.log(response);
		const data: Result = response.data;
		if (response.config.showLoading) {
			closeLoading();
		}
		// closeLoading();
		if (data.code === 500001) {
			//not authorized
			message.error("登录信息已过期，请重新登录");
			setTimeout(() => {
				storage.remove("token");
				location.href = "/login?callback=" + encodeURIComponent;
			}, 1000);
		} else if (data.code !== 0) {
			//api error, 0 means success, other code means error
			if (response.config.showError === false) {
				return Promise.resolve(data);
			} else {
				message.error(data.msg);
				return Promise.reject(data.msg);
			}
		}
		return data.data;
	},
	(error) => {
		closeLoading();
		message.error(error.message);
		return Promise.reject(error.message);
	}
);
interface IConfig {
	showLoading?: boolean;
	showError?: boolean;
}
export default {
	get<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
		return instance.get(url, { params, ...options });
	},
	post<T>(url: string, data?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
		return instance.post(url, data, options);
	},
};
