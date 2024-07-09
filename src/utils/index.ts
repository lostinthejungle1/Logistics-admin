export function formatCurrency(value: number) {
	return value.toLocaleString("zh-CN", { style: "currency", currency: "CNY" });
}

export function formatNumber(value: number) {
	return value.toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export function formatLocaleDateTime(date?: Date, rule?: string) {
	const curretDate = date || new Date();
	switch (rule) {
		case "date":
			return curretDate.toLocaleDateString("zh-CN").replaceAll("/", "-");
		case "timestamp":
			return curretDate.toLocaleTimeString("zh-CN");
		default:
			return curretDate.toLocaleString("zh-CN").replaceAll("/", "-");
	}
}

// format date not using toLocaleString
export function formatDate(date: Date, rule?: string) {
	let fmt = rule || "yyyy-MM-dd HH:mm:ss";
	fmt = fmt.replace(/(y+)/, date.getFullYear().toString());
	type oType = {
		[key: string]: number;
	};
	const o: oType = {
		"M+": date.getMonth() + 1, // 月份
		"d+": date.getDate(), // 日
		"H+": date.getHours(), // 小时
		"m+": date.getMinutes(), // 分
		"s+": date.getSeconds(), // 秒
	};

	for (const k in o) {
		const val = o[k].toString();
		fmt = fmt.replace(new RegExp(`(${k})`), ("00" + o[k]).substring(val.length));
	}
	return fmt;
}
