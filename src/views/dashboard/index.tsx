import { useBearStore } from "@/store";
import styles from "./index.module.less";
import { Button, Descriptions, Card } from "antd";
import CardUserInfo from "./card";
import { useEffect, useState } from "react";
import { formatState, formatNumber, formatCurrency } from "@/utils";
import api from "@/api";
import { Dashboard as DashboardType } from "@/types/api";
import useCharts from "@/hook/useCharts";

const Dashboard = () => {
	const [reportData, setReportData] = useState<DashboardType.ReportData>();
	const userInfo = useBearStore((state) => state.userInfo);
	const [lineChartRef, lineChartInstance] = useCharts();
	const [pieChartCityRef, pieChartCityInstance] = useCharts();
	const [pieChartAgeRef, pieChartAgeInstance] = useCharts();
	const [radarChartRef, radarChartInstance] = useCharts();

	const getReportData = async () => {
		const data = await api.getReportData();
		setReportData(data);
	};

	useEffect(() => {
		getReportData();
	}, []);

	const renderLineChart = async () => {
		if (!lineChartInstance) return;
		const data = await api.getLineChartData();
		lineChartInstance?.setOption({
			legend: {
				orient: "horizontal",
				right: 10,
				top: "top",
			},
			xAxis: {
				data: data.label,
			},
			yAxis: {
				type: "value",
			},
			tooltip: {
				trigger: "axis",
			},
			grid: {
				left: "5%",
				right: "5%",
			},
			series: [
				{
					data: data.order,
					type: "line",
					name: "订单",
				},
				{
					data: data.money,
					type: "line",
					name: "流水",
				},
			],
		});
	};

	const renderPieChartCity = async () => {
		if (!pieChartCityInstance) return;
		const data = await api.getPieChartCityData();
		pieChartCityInstance?.setOption({
			title: {
				text: "司机城市分布",
				// subtext: "Fake Data",
				left: "center",
			},
			tooltip: {
				trigger: "item",
			},
			legend: {
				orient: "vertical",
				left: "left",
			},
			series: [
				{
					name: "城市分布",
					type: "pie",
					radius: "50%",
					center: ["50%", "50%"], // Center the pie chart vertically and horizontally
					data: data,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: "rgba(0, 0, 0, 0.5)",
						},
					},
				},
			],
		});
	};

	const renderPieChartAge = async () => {
		if (!pieChartAgeInstance) return;
		const data = await api.getPieChartAgeData();
		pieChartAgeInstance?.setOption({
			title: {
				text: "司机年龄分布",
				subtext: "Fake Data",
				left: "center",
			},
			tooltip: {
				trigger: "item",
			},
			legend: {
				orient: "vertical",
				top: "5%",
				left: "left",
			},
			series: [
				{
					name: "年龄分布",
					type: "pie",
					roseType: "area",
					radius: ["20%", "70%"],
					center: ["50%", "50%"], // Center the pie chart vertically and horizontally
					avoidLabelOverlap: false,
					label: {
						show: false,
						position: "center",
					},
					labelLine: {
						show: false,
					},
					data: data,
				},
			],
		});
	};

	const renderRadarChart = async () => {
		if (!radarChartInstance) return;
		const data = await api.getRadarData();
		radarChartInstance?.setOption({
			legend: {
				data: ["司机模型诊断"],
			},
			tooltip: {},
			radar: {
				// shape: 'circle',
				indicator: data.indicator,
			},
			series: [
				{
					name: "Budget vs spending",
					type: "radar",
					data: data.data,
				},
			],
		});
	};
	useEffect(() => {
		renderLineChart();
		renderPieChartCity();
		renderPieChartAge();
		renderRadarChart();
	}, [lineChartInstance, pieChartCityInstance, pieChartAgeInstance, radarChartInstance]);

	return (
		<div className={styles.dashboard}>
			<div className={styles.userInfo}>
				<img
					className={styles.userImg}
					src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
					alt=""
				/>
				<Descriptions title={`欢迎${userInfo.userName}同学，每天都要开心！`}>
					<Descriptions.Item label="用户ID">{userInfo.createId}</Descriptions.Item>
					<Descriptions.Item label="邮箱">{userInfo.userEmail}</Descriptions.Item>
					<Descriptions.Item label="状态">{formatState(userInfo.state)}</Descriptions.Item>
					<Descriptions.Item label="手机号">{userInfo.mobile}</Descriptions.Item>
					<Descriptions.Item label="岗位">{userInfo.role}</Descriptions.Item>
					<Descriptions.Item label="部门">{userInfo.deptName}</Descriptions.Item>
				</Descriptions>
			</div>
			<div className={styles.cards}>
				<CardUserInfo label="司机数量" data={formatNumber(reportData?.driverCount) + "个"} />
				<CardUserInfo label="总流水" data={formatCurrency(reportData?.totalMoney) + "元"} />
				<CardUserInfo label="总订单" data={formatNumber(reportData?.orderCount) + "单"} />
				<CardUserInfo label="开通城市" data={formatNumber(reportData?.cityNum) + "个"} />
			</div>
			<div className={styles.charts}>
				<Card
					title="订单和流水走势图"
					extra={
						<Button type="primary" onClick={renderLineChart}>
							刷新
						</Button>
					}
				>
					<div ref={lineChartRef} className={styles.lineChart}></div>
				</Card>
				<Card
					title="司机分布"
					extra={
						<Button
							type="primary"
							onClick={() => {
								renderPieChartCity();
								renderPieChartAge();
							}}
						>
							刷新
						</Button>
					}
				>
					<div className={styles.pieChart}>
						<div ref={pieChartCityRef} className={styles.pieChartCity}></div>
						<div ref={pieChartAgeRef} className={styles.pieChartAge}></div>
					</div>
				</Card>
				<Card
					title="模型诊断"
					extra={
						<Button type="primary" onClick={renderRadarChart}>
							刷新
						</Button>
					}
				>
					<div ref={radarChartRef} className={styles.radarChart}></div>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
