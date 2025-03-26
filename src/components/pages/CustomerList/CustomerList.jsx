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
import api from "../../config/axios";

const { Option } = Select;

function CreateAccount() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchRestaurants();
  }, []);
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/restaurant/get");
      if (res.data.statusCode === 200) {
        setRestaurants(res.data.data);
      } else {
        message.error("Không thể lấy danh sách nhà hàng");
      }
    } catch (error) {
      message.error("Không thể lấy danh sách nhà hàng");
    }
  };

  // Lấy danh sách tài khoản
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/get/all");
      if (response.status === 200) {
        setUsers(response.data.data);
      } else {
        message.error("Không thể tải danh sách tài khoản!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("Lỗi API:", error);
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
        role: "",
        restaurant_id: "",
      }
    );
    setModalVisible(true);
  };

  //  Gửi dữ liệu để thêm/sửa tài khoản
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log(values);

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
    setLoading(false);
  };

  //  Xóa tài khoản
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      onOk: async () => {
        try {
          await api.delete(`/user/delete/${userId}`);
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
        Thêm Tài Khoản
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
        <Table.Column title="Tài khoản" dataIndex="username" key="username" />
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
              <Button onClick={() => openModal(record)} type={"primary"} block>
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
            label="Họ và tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Tên chỉ được chứa chữ cái và khoảng trắng!",
              },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Tên không được vượt quá 50 ký tự!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Email phải có đuôi @gmail.com",
              },
            ]}
          >
            <Input placeholder="Nhập email (@gmail.com)" />
          </Form.Item>

          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản" },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "Tài khoản chỉ được chứa chữ cái và số!",
              },
              { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự!" },
              { max: 20, message: "Tài khoản không được vượt quá 20 ký tự!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: !editingUser, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/,
                message:
                  "Mật khẩu phải chứa ít nhất 1 chữ cái thường, 1 chữ cái in hoa và 1 số!",
              },
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

          <Form.Item name="restaurant_id" label="Nhà hàng">
            <Select>
              {restaurants.map((restaurant) => (
                <Option
                  key={restaurant.restaurantId}
                  value={restaurant.restaurantId}
                >
                  {restaurant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateAccount;
