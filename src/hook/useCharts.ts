import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { RefObject } from "react";

const useCharts = (): [RefObject<HTMLDivElement>, echarts.ECharts | undefined] => {
	const ref = useRef<HTMLDivElement>(null);
	const [chartInstance, setChartInstance] = useState<echarts.ECharts>();
	useEffect(() => {
		if (ref.current) {
			const chart = echarts.init(ref.current);
			setChartInstance(chart);
			return () => {
				chart.dispose();
			};
		}
	}, []);
	return [ref, chartInstance];
};

export default useCharts;
