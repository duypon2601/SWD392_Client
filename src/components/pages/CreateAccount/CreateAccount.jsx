import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

function CreateAccount() {
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("user/get/all");
      setUsers(response.data.data);
    } catch (error) {
      message.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditTable = async (values) => {
    try {
      const payload = {
        user_id: editingUser ? editingUser.user_id : 0,
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
        role: values.role,
        restaurant_id: user?.restaurantId,
      };

      if (editingUser) {
        await api.put(`/user/${editingUser.user_id}`, payload);
        message.success("Cập nhật tài khoản thành công!");
        alert("cập tài khoản thành công ");
      } else {
        await api.post("/user/create", payload);
        message.success("Thêm tài khoản thành công!");
        alert("thêm tài khoản thành công ");
      }

      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Lỗi API:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi xử lý tài khoản!"
      );
    }
  };

  const openModal = (acc = null) => {
    setEditingUser(acc);
    setModalVisible(true);
    if (acc) {
      form.setFieldsValue(acc);
    } else {
      form.setFieldsValue({
        restaurant_id: user?.restaurantId,
      });
    }
  };
  console.log("User từ Redux:", user);
  console.log("restaurantId:", user?.restaurantId);

  const handleDeleteUsers = async (user_id) => {
    try {
      await api.delete(`/user/delete/${user_id}`);
      message.success("Xóa user thành công!");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi xóa useruser");
    }
  };
  const columns = [
    { title: "ID", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn?"
            onConfirm={() => handleDeleteUsers(record.user_id)}
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 10}}>
        Thêm Tài Khoản
      </Button>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingUser ? "Sửa bàn ăn" : "Thêm bàn ăn"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditTable}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Nhập tên đăng nhập!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Chọn vai trò!" }]}
          >
            <Select>
              <Select.Option value="MANAGER">Manager</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Nhà hàng">
            <Input value={user?.restaurantId} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateAccount;
