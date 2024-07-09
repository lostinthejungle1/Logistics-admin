import axios from "axios";
import { message } from "antd";

// Create an axios instance
const instance = axios.create({
	baseURL: "/api",
	timeout: 8000, // request timeout
	timeoutErrorMessage: "请求超时，请稍后重试",
	withCredentials: true,
});

//create request interceptor - add auth token
instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			config.headers.icode = "23B3904E1E8DE5DC";
		}
		return config;
	},
	(error) => Promise.reject(error)
);

//create response interceptor - handle response error
instance.interceptors.response.use((response) => {
	const data = response.data;
	if (data.code === 50001) {
		//not authorized
		message.error(data.msg);
		localStorage.removeItem("token");
		location.href = "/#/login";
	} else if (data.code !== 0) {
		//api error, 0 means success, other code means error
		message.error(data.msg);
		// location.href = "/#/login";
		return Promise.reject(data);
	}
	return data.data;
});

export default {
	get(url: string, params: object) {
		return instance.get(url, { params });
	},
	post(url: string, data: object) {
		return instance.post(url, data);
	},
};
