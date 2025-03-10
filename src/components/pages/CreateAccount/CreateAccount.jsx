import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
} from "antd";
import api from "../../config/axios"; // Đường dẫn API của bạn

const { Option } = Select;

function CreateAccount() {
  const [users, setUsers] = useState([]); // Danh sách tài khoản
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [modalVisible, setModalVisible] = useState(false); // Hiển thị modal
  const [editingUser, setEditingUser] = useState(null); // Người dùng đang chỉnh sửa
  const [form] = Form.useForm(); // Form Ant Design

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách tài khoản
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/get/all");
      if (res.status === 200) {
        setUsers(res.data.data);
      } else {
        message.error("Không thể tải danh sách tài khoản!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Mở modal thêm/sửa tài khoản
  const openModal = (user = null) => {
    setEditingUser(user);
    form.setFieldsValue(
      user || {
        name: "",
        email: "",
        username: "",
        password: "",
        role: "ADMIN",
        restaurant_id: "",
      }
    );
    setModalVisible(true);
  };

  //  Gửi dữ liệu để thêm/sửa tài khoản
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Sửa tài khoản
        await api.put(`/user/${editingUser.user_id}`, values);
        message.success("Cập nhật tài khoản thành công!");
      } else {
        // Thêm tài khoản mới
        await api.post("/user/create", { ...values, user_id: 0 });
        message.success("Thêm tài khoản thành công!");
      }
      fetchUsers(); // Load lại danh sách
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi lưu tài khoản!");
      console.error("API Error:", error);
    }
  };

  //  Xóa tài khoản
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      onOk: async () => {
        try {
          await api.delete(`/user/${userId}`);
          message.success("Xóa tài khoản thành công!");
          fetchUsers();
        } catch (error) {
          message.error("Lỗi khi xóa tài khoản!");
          console.error("API Error:", error);
        }
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => openModal()}>
        + Thêm Tài Khoản
      </Button>

      {/* Bảng danh sách tài khoản */}
      <Table
        dataSource={users}
        rowKey="user_id"
        loading={loading}
        style={{ marginTop: 20 }}
      >
        <Table.Column title="ID" dataIndex="user_id" key="user_id" />
        <Table.Column title="Tên" dataIndex="name" key="name" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column title="Username" dataIndex="username" key="username" />
        <Table.Column title="Vai trò" dataIndex="role" key="role" />
        <Table.Column
          title="Nhà Hàng"
          dataIndex="restaurant_name"
          key="restaurant_name"
        />
        <Table.Column
          title="Hành Động"
          key="actions"
          render={(text, record) => (
            <Space>
              <Button onClick={() => openModal(record)} type={"primary"}>
                Sửa
              </Button>
              <Button
                danger
                onClick={() => handleDelete(record.user_id)}
                type={"primary"}
              >
                Xóa
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Modal Thêm/Sửa Tài Khoản */}
      <Modal
        title={editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: !editingUser, message: "Vui lòng nhập mật khẩu!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="MANAGER">Manager</Option>
              <Option value="STAFF">Staff</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="ID Nhà Hàng"
            name="restaurant_id"
            rules={[{ required: true, message: "Vui lòng nhập ID nhà hàng!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateAccount;
