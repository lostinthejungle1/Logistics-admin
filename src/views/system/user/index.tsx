import api from "@/api";
import { PageParams, User } from "@/types/api";
import { formatLocaleDateTime } from "@/utils";
import { Button, Form, Input, Table, Flex, Select, Space, Modal, message } from "antd";

import type { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import CreateUser from "./CreateUser";

type TableRowSelection<T> = TableProps<T>["rowSelection"];

function UserList() {
	const userModalRef = useRef<{
		open: (type: "create" | "edit", data?: User.UserItem) => void;
	}>();
	const [form] = Form.useForm();
	const [data, setData] = useState<User.UserItem[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
	});

	const columns: TableProps<User.UserItem>["columns"] = [
		{ title: "用户ID", dataIndex: "userId", key: "userId" },
		{ title: "用户名称", dataIndex: "userName", key: "userName" },
		{ title: "邮箱", dataIndex: "userEmail", key: "userEmail" },
		{
			title: "用户角色",
			dataIndex: "role",
			key: "role",
			render: (role: number) => {
				return {
					0: "超级管理员",
					1: "管理员",
					2: "体验管理员",
					3: "普通用户",
				}[role];
			},
		},
		{
			title: "用户状态",
			dataIndex: "state",
			key: "state",
			render: (state: number) => {
				return {
					1: "在职",
					2: "离职",
					3: "试用期",
				}[state];
			},
		},
		{
			title: "注册时间",
			dataIndex: "createTime",
			key: "createTime",
			render: (createTime: string) => {
				return formatLocaleDateTime(new Date(createTime));
			},
		},
		{
			title: "操作",
			render: (value: User.UserItem) => {
				return (
					<Space>
						<Button
							type="text"
							onClick={() => {
								handleEdit(value);
							}}
						>
							编辑
						</Button>
						<Button type="text" danger onClick={() => handleDelete(value.userId)}>
							删除
						</Button>
					</Space>
				);
			},
		},
	];

	const handleEdit = (data: User.UserItem) => {
		console.log(data);
		userModalRef.current?.open("edit", data);
	};

	const handleDelete = (userId: number) => {
		Modal.confirm({
			title: "删除用户",
			content: <span>确定删除该用户吗？</span>,
			onOk: async () => {
				try {
					await api.delUser({ userIds: [userId] });
					message.success("删除成功");
					updateList();
				} catch (error) {
					message.error("删除失败");
				}
			},
		});
	};

	const handleBatchDelete = () => {
		if (selectedRowKeys.length === 0) return message.error("请选择要删除的用户");
		Modal.confirm({
			title: "批量删除用户",
			content: <span>确定删除选中用户吗？</span>,
			onOk: async () => {
				try {
					await api.delUser({ userIds: selectedRowKeys.map((key) => Number(key)) });
					setSelectedRowKeys([]);
					message.success("删除成功");
					updateList();
				} catch (error) {
					message.error("删除失败");
				}
			},
		});
	};

	const getUserList = async (params: PageParams) => {
		const formValues = form.getFieldsValue();
		const res = await api.getUserList({
			...formValues,
			pageNum: params.pageNum,
			pageSize: params.pageSize || pagination.pageSize,
		});
		setData(res.list);
		setTotal(res.page.total);
		// setTotal(res.page.total);
		setPagination({
			current: res.page.pageNum,
			pageSize: res.page.pageSize,
		});
	};

	useEffect(() => {
		getUserList({
			pageNum: pagination.current,
			pageSize: pagination.pageSize,
		});
	}, [pagination.current, pagination.pageSize]);

	// table related
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [loading, setLoading] = useState(false);

	const start = () => {
		setLoading(true);
		// ajax request after empty completing
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoading(false);
		}, 1000);
	};

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection: TableRowSelection<User.UserItem> = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const hasSelected = selectedRowKeys.length > 0;

	// const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
	// 	console.log("Success:", values);
	// };

	const handleCreate = () => {
		userModalRef.current?.open("create");
	};

	const updateList = () => getUserList({ pageNum: 1, pageSize: pagination.pageSize });

	return (
		<div className="userlist">
			<div className="searchForm">
				<Form layout="inline" form={form} initialValues={{ state: 1 }}>
					<Form.Item label="用户ID" name="userId">
						<Input placeholder="请输入用户ID" />
					</Form.Item>
					<Form.Item label="用户名称" name="userName">
						<Input placeholder="请输入用户名称" />
					</Form.Item>
					<Form.Item label="状态" name="state">
						<Select
							style={{ width: 120 }}
							options={[
								{ value: 0, label: "所有" },
								{ value: 1, label: "在职" },
								{ value: 2, label: "离职" },
								{ value: 3, label: "试用期" },
							]}
						/>
					</Form.Item>
					<Form.Item>
						<Space>
							<Button
								type="primary"
								htmlType="submit"
								onClick={() => {
									// getUserList({
									// 	pageNum: 1,
									// 	pageSize: pagination.pageSize,
									// });
									updateList();
								}}
							>
								搜索
							</Button>
							<Button
								type="default"
								onClick={() => {
									form.resetFields();
									// getUserList({
									// 	pageNum: 1,
									// 	pageSize: pagination.pageSize,
									// });
									updateList();
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
					<div className="title">用户列表</div>
					<div className="action">
						<Button type="primary" onClick={handleCreate}>
							新增
						</Button>
						<Button type="primary" danger onClick={handleBatchDelete}>
							批量删除
						</Button>
					</div>
				</div>
				<Flex gap="middle" vertical>
					<Flex align="center" gap="middle">
						<Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
							Reload
						</Button>
						{hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
					</Flex>
					<Table
						rowKey="userId"
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						bordered
						pagination={{
							position: ["bottomRight"],
							current: pagination.current,
							pageSize: pagination.pageSize,
							showQuickJumper: true,
							showSizeChanger: true,
							total: total,
							showTotal: (total) => `Total ${total} items`,
							onChange: (page, pageSize) => {
								setPagination({ current: page, pageSize });
							},
						}}
					/>
				</Flex>
			</div>
			<CreateUser ref={userModalRef} update={updateList} />
		</div>
	);
}

export default UserList;
