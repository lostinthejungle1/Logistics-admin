import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { message } from "@/utils/AntdGlobal";
import { forwardRef, useImperativeHandle } from "react";
import { Role } from "@/types/api";
import api from "@/api";

const CreateRole = forwardRef(({ update }: { update: () => void }, ref) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [form] = Form.useForm();

	useImperativeHandle(ref, () => {
		return {
			open,
		};
	});
	// 调用弹框显示方法
	const open = (type: "create" | "edit", data?: Role.RoleItem) => {
		setAction(type);
		setVisible(true);
		if (type === "edit" && data) {
			form.setFieldsValue(data);
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (values) {
				if (action === "create") {
					const params: Role.CreateParams = {
						...values,
					};
					try {
						await api.createRole(params);
						message.success("创建成功");
					} catch (error) {
						message.error("创建失败");
					}
				} else if (action === "edit") {
					const params: Role.EditParams = {
						...values,
					};
					try {
						await api.editRole(params);
						message.success("更新成功");
					} catch (error) {
						message.error("更新失败");
					}
				}
				handleCancel();
				update();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancel = () => {
		setVisible(false);
		form.resetFields();
	};

	return (
		<div>
			<Modal
				title={action === "create" ? "创建角色" : "编辑角色"}
				open={visible}
				onOk={handleSubmit}
				okText="确定"
				cancelText="取消"
				onCancel={handleCancel}
				width={800}
			>
				<Form form={form} labelCol={{ span: 4 }} labelAlign="right">
					{action === "edit" ? (
						<Form.Item label="角色ID" name="_id">
							<Input disabled />
						</Form.Item>
					) : null}
					<Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: "请输入角色名称" }]}>
						<Input placeholder="请输入角色名称" />
					</Form.Item>
					<Form.Item label="备注" name="remark">
						<Input.TextArea placeholder="请输入备注" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
});

export default CreateRole;
