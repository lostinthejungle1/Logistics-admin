import React from "react";
import ReactDOM from "react-dom/client";
import Loading from "./Loading";

let count = 0;

export const showLoading = () => {
	if (count === 0) {
		const loading = document.createElement("div");
		loading.id = "loading";
		document.body.appendChild(loading);
		ReactDOM.createRoot(loading!).render(<Loading tip="加载中" />);
	}
	count++;
};

export const closeLoading = () => {
	count--;
	if (count === 0) {
		const loading = document.getElementById("loading");
		if (loading) {
			document.body.removeChild(loading);
		}
	}
};
