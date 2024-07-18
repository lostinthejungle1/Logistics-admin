import api from "@/api";
import { Menu } from "@/types/api";
import { Form, Input, Space, Button, Table, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { message } from "@/utils/AntdGlobal";
import { formatLocaleDateTime } from "@/utils";
import CreateMenu from "./CreateMenu";

const MenuList = () => {
	const [data, setData] = useState<Menu.MenuItem[]>([]);
	const menuModalRef = useRef<{
		open: (type: "create" | "edit", data?: Menu.MenuItem | { parentId?: string; orderBy?: number }) => void;
	}>(null);

	useEffect(() => {
		getMenuList();
	}, []);

	const getMenuList = async () => {
		const data = await api.getMenuList(form.getFieldsValue());
		setData(data);
	};
	const [form] = Form.useForm();
	const columns = [
		{
			title: "菜单名称",
			dataIndex: "menuName",
			key: "menuName",
		},
		{
			title: "图标",
			dataIndex: "icon",
			key: "icon",
		},
		{
			title: "菜单类型",
			dataIndex: "menuType",
			key: "menuType",
			render(menuType: number) {
				return ["菜单", "按钮", "页面"][menuType - 1];
			},
		},
		{
			title: "权限标识",
			dataIndex: "menuCode",
			key: "menuCode",
		},
		{
			title: "路由地址",
			dataIndex: "path",
			key: "path",
		},
		{
			title: "组件名称",
			dataIndex: "component",
			key: "component",
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
			render: (value: Menu.MenuItem) => {
				return (
					<>
						<Button
							type="text"
							onClick={() =>
								menuModalRef.current?.open("create", { parentId: value._id, orderBy: value.children?.length })
							}
						>
							新增
						</Button>
						<Button type="text" onClick={() => menuModalRef.current?.open("edit", value)}>
							编辑
						</Button>
						<Button
							type="text"
							danger
							onClick={() => {
								Modal.confirm({
									title: "提示",
									content:
										"确定删除该" +
										{
											1: "菜单",
											2: "按钮",
											3: "页面",
										}[value.menuType] +
										"吗？",
									onOk: async () => {
										await api.delMenu({ _id: value._id });
										message.success("删除成功");
										getMenuList();
									},
									okText: "确定",
									cancelText: "取消",
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
		<div className="menuList">
			<div className="searchForm">
				<Form layout="inline" form={form} initialValues={{ menuState: 1 }}>
					<Form.Item label="菜单名称" name="menuName">
						<Input placeholder="请输入菜单名称" />
					</Form.Item>
					<Form.Item label="菜单状态" name="menuState">
						<Select style={{ width: 120 }}>
							<Select.Option value={1}>正常</Select.Option>
							<Select.Option value={2}>禁用</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Space>
							<Button
								type="primary"
								htmlType="submit"
								onClick={() => {
									getMenuList();
								}}
							>
								搜索
							</Button>
							<Button
								type="default"
								onClick={() => {
									form.resetFields();
									getMenuList();
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
					<div className="title">菜单列表</div>
					<div className="action">
						<Button type="primary" onClick={() => menuModalRef.current?.open("create", { orderBy: data.length })}>
							新增
						</Button>
					</div>
				</div>
				<Table rowKey="_id" columns={columns} dataSource={data} pagination={false} />
			</div>
			<CreateMenu ref={menuModalRef} update={getMenuList} />
		</div>
	);
};

export default MenuList;
