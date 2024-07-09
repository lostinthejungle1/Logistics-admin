import axios from "axios";
import { message } from "antd";
import { closeLoading, showLoading } from "./loading";

// Create an axios instance
const instance = axios.create({
	baseURL: "/api",
	timeout: 5000, // request timeout
	timeoutErrorMessage: "请求超时，请稍后重试",
	withCredentials: true,
});

//create request interceptor - add auth token
instance.interceptors.request.use(
	(config) => {
		showLoading();
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			config.headers.icode = "23B3904E1E8DE5DC";
		}
		return config;
	},
	(error) => Promise.reject(error.message)
);

//create response interceptor - handle response error
instance.interceptors.response.use(
	(response) => {
		// console.log(response);
		const data = response.data;
		closeLoading();
		if (data.code === 50001) {
			//not authorized
			message.error(data.msg);
			localStorage.removeItem("token");
			location.href = "/#/login";
		} else if (data.code !== 0) {
			//api error, 0 means success, other code means error
			message.error(data.msg);
			// location.href = "/#/login";
			return Promise.reject(data.msg);
		}
		return data.data;
	},
	(error) => {
		closeLoading();
		message.error(error.message);
		return Promise.reject(error.message);
	}
);

export default {
	get<T>(url: string, params?: object): Promise<T> {
		return instance.get(url, { params });
	},
	post<T>(url: string, data?: object): Promise<T> {
		return instance.post(url, data);
	},
};
