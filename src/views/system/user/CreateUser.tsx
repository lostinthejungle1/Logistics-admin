import storage from "@/utils/storage";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select, TreeSelect, Upload, UploadProps } from "antd";
import { useState } from "react";
import { message } from "@/utils/AntdGlobal";
import { forwardRef, useImperativeHandle } from "react";
import { Dept, Role, User } from "@/types/api";
import api from "@/api";

const CreateUser = forwardRef(({ update }: { update: () => void }, ref) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [form] = Form.useForm();
	const [avatar, setAvatar] = useState<string | null>(null);
	const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
	const [depts, setDepts] = useState<Dept.DeptItem[]>([]);
	const [roles, setRoles] = useState<Role.RoleItem[]>([]);

	useImperativeHandle(ref, () => {
		return {
			open,
		};
	});
	// 调用弹框显示方法
	const open = (type: "create" | "edit", data?: User.UserItem) => {
		setAction(type);
		setVisible(true);
		if (type === "edit" && data) {
			form.setFieldsValue(data);
			setAvatar(data.userImg);
		}
		api.getDeptList().then((res) => {
			setDepts(res);
		});

		api.getAllRoles().then((res) => {
			setRoles(res);
		});
	};
	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (values) {
				if (action === "create") {
					const params: User.CreateParams = {
						...values,
						userImg: avatar,
					};
					try {
						const data = await api.createUser(params);
						message.success("创建成功");
						console.log(data);
					} catch (error) {
						message.error("创建失败");
					}
				} else if (action === "edit") {
					console.log(values);
					const params: User.EditParams = {
						...values,
						userImg: avatar,
					};
					try {
						const data = await api.editUser(params);
						message.success("更新成功");
						console.log(data);
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
		setAvatar(null);
	};

	const beforeUpload = (file: File) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			message.error("You can only upload JPG/PNG file!");
		}
		const isLt2M = file.size / 1024 / 1024 < 0.5;
		if (!isLt2M) {
			message.error("Image must smaller than 500K!");
		}
		return isJpgOrPng && isLt2M;
	};

	const handleChange: UploadProps["onChange"] = (info) => {
		if (info.file.status === "uploading") {
			setAvatarLoading(true);
			return;
		}
		if (info.file.status === "done") {
			setAvatarLoading(false);
			const { code, data, msg } = info.file.response;
			if (code === 0) {
				setAvatar(data.file);
			} else {
				message.error(msg);
			}
		} else if (info.file.status === "error") {
			message.error("上传失败");
		}
	};
	return (
		<div>
			<Modal
				title={action === "create" ? "创建用户" : "编辑用户"}
				open={visible}
				onOk={handleSubmit}
				okText="确定"
				cancelText="取消"
				onCancel={handleCancel}
			>
				<Form form={form} labelCol={{ span: 4 }} labelAlign="right">
					{action === "edit" ? (
						<Form.Item label="用户ID" name="userId">
							<Input disabled />
						</Form.Item>
					) : null}
					<Form.Item
						label="用户名称"
						name="userName"
						rules={[
							{ required: true, message: "请输入用户名称" },
							{ min: 5, max: 12, message: "用户名称最小5个字符，最大12个字符" },
						]}
					>
						<Input placeholder="请输入用户名称" />
					</Form.Item>
					<Form.Item
						label="邮箱"
						name="userEmail"
						rules={[
							{ required: true, message: "请输入用户邮箱" },
							// { type: "email", message: "请输入格式正确的邮箱" },
							{ pattern: /^\w+@aplus.com$/, message: "请输入aplus.com结尾的邮箱" },
						]}
					>
						<Input placeholder="请输入邮箱" disabled={action === "edit"} />
					</Form.Item>
					<Form.Item
						label="手机号"
						name="mobile"
						rules={[
							{ len: 11, message: "手机号必须为11位数字" },
							{ pattern: /1[1-9]\d{9}/, message: "手机号格式不对" },
						]}
					>
						<Input type="number" placeholder="请输入手机号" />
					</Form.Item>
					<Form.Item label="部门" name="deptId" rules={[{ required: true, message: "请选择部门" }]}>
						{/* <Input placeholder="请输入部门" /> */}
						<TreeSelect
							treeData={depts}
							allowClear
							treeDefaultExpandAll
							fieldNames={{ value: "_id", label: "deptName" }}
							showCheckedStrategy={TreeSelect.SHOW_ALL}
							placeholder="请选择部门"
						/>
					</Form.Item>
					<Form.Item label="岗位" name="job">
						<Input placeholder="岗位" />
					</Form.Item>
					<Form.Item label="状态" name="state">
						<Select
							options={[
								{ value: 1, label: "在职" },
								{ value: 2, label: "离职" },
								{ value: 3, label: "试用期" },
							]}
						/>
					</Form.Item>
					<Form.Item label="角色" name="roleList" rules={[{ required: true, message: "请选择角色" }]}>
						{/* <Input placeholder="角色" /> */}
						<Select placeholder="请选择角色">
							{roles.map((item) => (
								<Select.Option key={item._id} value={item._id}>
									{item.roleName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="头像">
						<Upload
							listType="picture-circle"
							showUploadList={false}
							headers={{
								Authorization: "Bearer " + storage.get("token"),
								icode: "123456",
							}}
							action="/api/users/upload"
							beforeUpload={beforeUpload}
							onChange={handleChange}
						>
							{avatar ? (
								<img
									src={avatar}
									alt="avatar"
									style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "100%" }}
								/>
							) : (
								<div>
									{avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
									<div>上传头像</div>
								</div>
							)}
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
});

export default CreateUser;
