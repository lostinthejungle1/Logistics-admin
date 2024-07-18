import { Form, Modal, Input, TreeSelect, Radio } from "antd";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Menu } from "@/types/api";
import api from "@/api";
import { message } from "@/utils/AntdGlobal";
import { InfoCircleOutlined } from "@ant-design/icons";

const CreateMenu = forwardRef(({ update }: { update: () => void }, ref) => {
	const [visible, setVisible] = useState(false);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [form] = Form.useForm();
	const [menuList, setMenuList] = useState<Menu.MenuItem[]>([]);

	useImperativeHandle(ref, () => {
		return {
			open,
		};
	});

	const open = (type: "create" | "edit", data?: Menu.MenuItem | { parentId?: string; orderBy?: number }) => {
		setAction(type);
		setVisible(true);
		api.getMenuList().then((res) => {
			setMenuList(res);
		});
		if (type === "create" && data) {
			form.setFieldsValue(data);
		}
		if (type === "edit" && data) {
			form.setFieldsValue(data);
		}
	};

	const handleSubmit = async () => {
		const value = await form.validateFields();
		if (value) {
			if (action === "create") {
				try {
					await api.createMenu(form.getFieldsValue());
					message.success("新增成功");
				} catch (err) {
					message.error("新增失败");
				}
			} else if (action === "edit") {
				try {
					await api.editMenu(form.getFieldsValue());
					message.success("编辑成功");
				} catch (err) {
					message.error("编辑失败");
				}
			}
			handleCancel();
			update();
		}
	};
	const handleCancel = () => {
		form.resetFields();
		setVisible(false);
	};

	return (
		<Modal
			title={action === "create" ? "新增菜单" : "编辑菜单"}
			open={visible}
			okText="确定"
			cancelText="取消"
			onOk={handleSubmit}
			onCancel={handleCancel}
			width={800}
		>
			<Form
				form={form}
				labelCol={{ span: 4 }}
				labelAlign="right"
				initialValues={{
					menuType: 1,
					menuState: 1,
				}}
			>
				{action === "edit" && (
					<Form.Item label="菜单ID" name="_id">
						<Input disabled />
					</Form.Item>
				)}
				<Form.Item label="父级菜单" name="parentId">
					<TreeSelect
						treeData={menuList}
						allowClear
						treeDefaultExpandAll
						fieldNames={{ value: "_id", label: "menuName" }}
					/>
				</Form.Item>
				<Form.Item label="菜单类型" name="menuType" rules={[{ required: true, message: "请选择菜单类型" }]}>
					<Radio.Group>
						<Radio value={1}>菜单</Radio>
						<Radio value={2}>按钮</Radio>
						<Radio value={3}>页面</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item label="菜单名称" name="menuName" rules={[{ required: true, message: "请输入菜单名称" }]}>
					<Input placeholder="请输入菜单名称" />
				</Form.Item>
				<Form.Item shouldUpdate noStyle>
					{() => {
						return form.getFieldValue("menuType") === 2 ? (
							<Form.Item label="权限标识" name="menuCode">
								<Input placeholder="请输入权限标识" />
							</Form.Item>
						) : (
							<>
								<Form.Item label="菜单图标" name="icon">
									<Input placeholder="请输入菜单图标" />
								</Form.Item>
								<Form.Item label="路由地址" name="path">
									<Input placeholder="请输入路由地址" />
								</Form.Item>
								<Form.Item label="组件地址" name="component">
									<Input placeholder="请输入组件地址" />
								</Form.Item>
							</>
						);
					}}
				</Form.Item>

				<Form.Item label="排序" name="orderBy" tooltip={{ title: "排序值越大越靠后", icon: <InfoCircleOutlined /> }}>
					<Input type="number" style={{ width: 100 }} />
				</Form.Item>
				<Form.Item label="菜单状态" name="menuState">
					<Radio.Group>
						<Radio value={1}>正常</Radio>
						<Radio value={2}>禁用</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
});

export default CreateMenu;
