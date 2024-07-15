import { useBearStore } from "@/store";
import styles from "./index.module.less";
import { Button, Descriptions, Card } from "antd";
import CardUserInfo from "./card";
import * as echarts from "echarts";
import { useEffect } from "react";
const Dashboard = () => {
	const userInfo = useBearStore((state) => state.userInfo);
	useEffect(() => {
		// todo: using customized hook to refine code
		const lineChartDOM = document.getElementById("lineChart");
		const pieChartCityDOM = document.getElementById("pieChartCity");
		const pieChartAgeDOM = document.getElementById("pieChartAge");
		const radarChartDOM = document.getElementById("radarChart");
		const lineCHart = echarts.init(lineChartDOM);
		const pieChartCity = echarts.init(pieChartCityDOM);
		const pieChartAge = echarts.init(pieChartAgeDOM);
		const radarChart = echarts.init(radarChartDOM);
		lineCHart.setOption({
			legend: {
				orient: "horizontal",
				right: 10,
				top: "top",
			},
			xAxis: {
				data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
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
					data: [10, 22, 28, 43, 49, 10, 22, 28, 43, 49, 12, 20],
					type: "line",
					name: "订单",
				},
				{
					data: [5, 4, 3, 5, 10, 13, 5, 4, 3, 5, 10, 13],
					type: "line",
					name: "流水",
				},
			],
		});
		pieChartCity.setOption({
			title: {
				text: "司机城市分布",
				subtext: "Fake Data",
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
					data: [
						{ value: 20, name: "上海" },
						{ value: 10, name: "北京" },
						{ value: 15, name: "深圳" },
						{ value: 48, name: "杭州" },
						{ value: 3, name: "长沙" },
					],
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
		pieChartAge.setOption({
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
					data: [
						{ value: 1048, name: "20-29岁" },
						{ value: 735, name: "30-39岁" },
						{ value: 580, name: "40-49岁" },
						{ value: 484, name: "50-59岁" },
						{ value: 300, name: "60以上" },
					],
				},
			],
		});
		radarChart.setOption({
			legend: {
				data: ["司机模型诊断"],
			},
			radar: {
				// shape: 'circle',
				indicator: [
					{ name: "服务态度", max: 6500 },
					{ name: "关注度", max: 16000 },
					{ name: "评分", max: 30000 },
					{ name: "接单率", max: 38000 },
					{ name: "在线时长", max: 52000 },
				],
			},
			series: [
				{
					name: "Budget vs spending",
					type: "radar",
					data: [
						{
							value: [4200, 3000, 20000, 35000, 50000, 18000],
							name: "Allocated Budget",
						},
					],
				},
			],
		});
	}, []);

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
					<Descriptions.Item label="状态">{userInfo.state}</Descriptions.Item>
					<Descriptions.Item label="手机号">{userInfo.mobile}</Descriptions.Item>
					<Descriptions.Item label="岗位">{userInfo.role}</Descriptions.Item>
					<Descriptions.Item label="部门">{userInfo.deptName}</Descriptions.Item>
				</Descriptions>
			</div>
			<div className={styles.cards}>
				<CardUserInfo label="司机数量" data="100个" />
				<CardUserInfo label="总流水" data="1000元" />
				<CardUserInfo label="总订单" data="20000单" />
				<CardUserInfo label="开通城市" data="50个" />
			</div>
			<div className={styles.charts}>
				<Card title="订单和流水走势图" extra={<Button type="primary">刷新</Button>}>
					<div id="lineChart" className={styles.lineChart}></div>
				</Card>
				<Card title="司机分布" extra={<Button type="primary">刷新</Button>}>
					<div className={styles.pieChart}>
						<div id="pieChartCity" className={styles.pieChartCity}></div>
						<div id="pieChartAge" className={styles.pieChartAge}></div>
					</div>
				</Card>
				<Card title="模型诊断" extra={<Button type="primary">刷新</Button>}>
					<div id="radarChart" className={styles.radarChart}></div>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
