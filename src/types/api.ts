/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
//接口类型定义

export interface Result<T = any> {
	code: number;
	msg: string;
	data: T;
}
export namespace login {
	export interface params {
		userName: string;
		userPwd: string;
	}
}
