// 封装localstorage的使用

export default {
	set(key: string, value: unknown) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	get(key: string) {
		const value = localStorage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		} else {
			return null;
		}
	},
	remove(key: string) {
		localStorage.removeItem(key);
	},
	clear() {
		localStorage.clear();
	},
};
