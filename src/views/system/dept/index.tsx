import api from "@/api";
import { Dept } from "@/types/api";
import { Form, Input, Space, Button, Table, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import CreateDept from "./CreateDept";
import { message } from "@/utils/AntdGlobal";
import { formatLocaleDateTime } from "@/utils";

const DeptList = () => {
	const [data, setData] = useState<Dept.DeptItem[]>([]);
	const deptModalRef = useRef<{
		open: (type: "create" | "edit", data?: Dept.DeptItem | { parentId?: string }) => void;
	}>();

	useEffect(() => {
		getDeptList();
	}, []);

	const updateDeptList = () => {
		getDeptList();
	};

	const getDeptList = async () => {
		const data = await api.getDeptList({ ...form.getFieldsValue() });
		setData(data);
	};
	const [form] = Form.useForm();
	const columns = [
		{
			title: "部门名称",
			dataIndex: "deptName",
			key: "deptName",
			width: 200,
		},
		{
			title: "负责人",
			dataIndex: "userName",
			key: "userName",
		},
		{
			title: "更新时间",
			dataIndex: "updateTime",
			key: "updateTime",
			render(updateTime: string) {
				return formatLocaleDateTime(new Date(updateTime));
			},
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime",
			render(createTime: string) {
				return formatLocaleDateTime(new Date(createTime));
			},
		},
		{
			title: "操作",
			key: "action",
			width: 250,
			render: (value: Dept.DeptItem) => {
				return (
					<>
						<Button
							type="text"
							onClick={async () => {
								deptModalRef.current?.open("create", { parentId: value._id });
							}}
						>
							新增
						</Button>
						<Button
							type="text"
							onClick={() => {
								deptModalRef.current?.open("edit", value);
							}}
						>
							编辑
						</Button>
						<Button
							type="text"
							danger
							onClick={async () => {
								Modal.confirm({
									title: "删除",
									content: "确定删除该部门吗？",
									okText: "确定",
									cancelText: "取消",
									async onOk() {
										try {
											await api.delDept({ _id: value._id });
											updateDeptList();
											message.success("删除成功");
										} catch (err) {
											message.error("删除失败");
										}
									},
								});
							}}
						>
							删除
						</Button>
					</>
				);
			},
		},
	];
	return (
		<div className="deptList">
			<div className="searchForm">
				<Form layout="inline" form={form}>
					<Form.Item label="部门名称" name="deptName">
						<Input placeholder="请输入部门名称" />
					</Form.Item>
					<Form.Item>
						<Space>
							<Button
								type="primary"
								htmlType="submit"
								onClick={() => {
									getDeptList();
									updateDeptList();
								}}
							>
								搜索
							</Button>
							<Button
								type="default"
								onClick={() => {
									form.resetFields();
									updateDeptList();
								}}
							>
								重置
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</div>
			<div className="baseTable">
				<div className="headerWrapper">
					<div className="title">部门列表</div>
					<div className="action">
						<Button type="primary" onClick={() => deptModalRef.current?.open("create")}>
							新增
						</Button>
					</div>
				</div>
				<Table rowKey="_id" columns={columns} dataSource={data} pagination={false} />
			</div>
			<CreateDept ref={deptModalRef} update={updateDeptList} />
		</div>
	);
};

export default DeptList;
