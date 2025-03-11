import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import api from "../../config/axios";

const { Content } = Layout;
const { Option } = Select;

function TaoNhanVien() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [restaurantList, setRestaurantList] = useState([]);
  const [roles, setRoles] = useState(["Admin", "Manager", "Staff"]);

  // Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/get/all");
      if (response.data.statusCode === 200) {
        setDataSource(response.data.data);
      } else {
        message.error("Không thể lấy danh sách nhân viên!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách nhà hàng
  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurant/get");
      if (response.data.statusCode === 200) {
        setRestaurantList(response.data.data);
      }
    } catch (error) {
      message.error("Lỗi khi lấy danh sách nhà hàng!");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRestaurants();
  }, []);

  // Mở modal chỉnh sửa hoặc thêm mới
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setVisible(true);
  };

  const resetForm = () => {
    form.resetFields();
    setEditingEmployee(null);
    setVisible(false);
  };

  // Gửi API thêm/sửa nhân viên
  
  
  const handleSubmit = async (values) => {
    try {
      const payload = {
        user_id: editingEmployee ? editingEmployee.user_id : 0, // Đặt ID mặc định nếu tạo mới
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
        role: values.role.toUpperCase(), // Chuyển vai trò thành chữ in hoa
        restaurant_id: values.restaurant_id,
        restaurant_name: restaurantList.find(r => r.restaurant_id === values.restaurant_id)?.name || "",
      };
  
      let response;
      if (editingEmployee) {
        response = await api.put(`/user/${editingEmployee.user_id}`, payload);
      } else {
        response = await api.post("/user/create", payload);
      }
  
      if (response.data.statusCode === 200) {
        message.success(editingEmployee ? "Cập nhật thành công!" : "Thêm nhân viên thành công!");
        fetchEmployees();
        resetForm();
      } else {
        message.error(response.data.message || "Lỗi khi gửi yêu cầu!");
      }
    } catch (error) {
      message.error("Không thể kết nối API!");
    }
  };
  

  // Xóa nhân viên
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/delete/${id}`);
      if (response.data.statusCode === 200) {
        setDataSource((prev) => prev.filter((user) => user.user_id !== id));
        message.success("Xóa nhân viên thành công!");
      } else {
        message.error("Không thể xóa nhân viên!");
      }
    } catch (error) {
      message.error("Lỗi khi xóa nhân viên!");
    }
  };
  
  
  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách Nhân Viên</h1>
      <Button type="primary" onClick={() => setVisible(true)}>Thêm Nhân Viên</Button>
      {loading ? <Spin /> : (
        <Table dataSource={dataSource} columns={[
          { title: "Tên Nhân Viên", dataIndex: "name", key: "name" },
          { title: "Email", dataIndex: "email", key: "email" },
          
          { title: "Tài Khoản", dataIndex: "username", key: "username" },
          { title: "ID Nhà Hàng", dataIndex: "restaurant_id", key: "restaurant_id" },
          { title: "Vai Trò", dataIndex: "role", key: "role" },
          {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
              <>
                <Button type="primary" style={{ marginRight: "5px" }} onClick={() => openEditModal(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.user_id)} okText="Xóa" cancelText="Hủy">
                  <Button type="primary" danger>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]} rowKey="user_id" />
      )}

      <Modal title={editingEmployee ? "Chỉnh sửa Nhân Viên" : "Thêm Nhân Viên"} open={visible} onCancel={resetForm} onOk={() => form.validateFields().then(handleSubmit).catch(() => {})}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Nhân Viên" rules={[{ required: true, message: "Nhập tên nhân viên" }]}><Input /></Form.Item>
          <Form.Item
  label="Email"
  name="email"
  rules={[
    { required: true, message: "Vui lòng nhập email!" },
    { 
      pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, 
      message: "Email phải có đuôi @gmail.com" 
    }
  ]}
>
  <Input />
</Form.Item>

          

          <Form.Item name="username" label="Tài Khoản" rules={[{ required: true, message: "Nhập tài khoản" }]}><Input /></Form.Item>
          <Form.Item name="password" label="Mật Khẩu" rules={[{ required: true, message: "Nhập mật khẩu" }]}><Input.Password /></Form.Item>
          <Form.Item name="restaurantid" label="Nhà Hàng" rules={[{ required: true, message: "Chọn nhà hàng" }]}> 
            <Select>
              {restaurantList.map((res) => (
                <Option key={res.restaurantid} value={res.restaurantid}>{res.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Vai Trò" rules={[{ required: true, message: "Chọn vai trò" }]}> 
  <Select>
    <Option value="Admin">Admin</Option>
    <Option value="Manager">Manager</Option>
    <Option value="Staff">Staff</Option>
    
  </Select>
</Form.Item>

        </Form>
      </Modal>
    </Content>
  );
}

export default TaoNhanVien;
