import { Form, Modal, Input, Select, TreeSelect } from "antd";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Dept } from "@/types/api";
import api from "@/api";
import { message } from "@/utils/AntdGlobal";

const CreateDept = forwardRef(({ update }: { update: () => void }, ref) => {
	const [visible, setVisible] = useState(false);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [form] = Form.useForm();
	const [users, setUsers] = useState<string[]>([]);
	const [depts, setDepts] = useState<Dept.DeptItem[]>([]);

	useImperativeHandle(ref, () => {
		return {
			open,
		};
	});

	const open = (type: "create" | "edit", data?: Dept.DeptItem | { parentId: string }) => {
		setAction(type);
		setVisible(true);
		Promise.all([api.getUsersAll(), api.getDeptList()]).then((res) => {
			setUsers(res[0].map((item) => item.userName));
			setDepts(res[1]);
		});
		if (type === "create") {
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
					await api.createDept(form.getFieldsValue());
					message.success("新增成功");
				} catch (err) {
					message.error("新增失败");
				}
			} else if (action === "edit") {
				try {
					await api.editDept(form.getFieldsValue());
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
			title={action === "create" ? "新增部门" : "编辑部门"}
			open={visible}
			okText="确定"
			cancelText="取消"
			onOk={handleSubmit}
			onCancel={handleCancel}
			width={800}
		>
			<Form form={form} labelCol={{ span: 4 }} labelAlign="right">
				{action === "edit" && (
					<Form.Item label="部门ID" name="_id">
						<Input disabled />
					</Form.Item>
				)}
				{/* <Form.Item label="上级部门" name="parentId">
					<Select placeholder="请选择上级部门" disabled={!!parentId}></Select>
				</Form.Item> */}
				<Form.Item label="上级部门" name="parentId">
					<TreeSelect
						treeData={depts}
						allowClear
						treeDefaultExpandAll
						fieldNames={{ value: "_id", label: "deptName" }}
					/>
				</Form.Item>
				<Form.Item label="部门名称" name="deptName" rules={[{ required: true, message: "请输入部门名称" }]}>
					<Input placeholder="请输入部门名称" />
				</Form.Item>
				<Form.Item label="负责人" name="userName" rules={[{ required: true, message: "请选择负责人" }]}>
					<Select placeholder="请选择负责人">
						{users.length
							? users.map((item) => (
									<Select.Option key={item} value={item}>
										{item}
									</Select.Option>
								))
							: null}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
});

export default CreateDept;
