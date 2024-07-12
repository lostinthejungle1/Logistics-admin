import request from "@/utils/request";
import { login } from "@/types/api";

export default {
	login(params: login.params): Promise<string> {
		return request.post<string>("/users/login", params);
	},
};
