import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import api from "../../config/axios";

const { Content } = Layout;
const { Option } = Select;

function EmployeeList() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("user/get/all");
      setDataSource(response.data.data);
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      message.error("Không thể lấy danh sách nhân viên. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingEmployee) {
        await api.put(`user/update/${editingEmployee.user_id}`, values);
        setDataSource(dataSource.map((item) => (item.user_id === editingEmployee.user_id ? { ...item, ...values } : item)));
        message.success("Cập nhật nhân viên thành công!");
      } else {
        const response = await api.post("user/create", values);
        setDataSource([...dataSource, response.data]);
        message.success("Thêm nhân viên thành công!");
      }
      resetForm();
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`user/delete/${id}`);
      setDataSource(dataSource.filter((item) => item.user_id !== id));
      message.success("Xóa nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      message.error("Không thể xóa nhân viên");
    }
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setVisible(true);
  };

  const resetForm = () => {
    setVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const columns = [
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    { title: "Nhà hàng", dataIndex: "restaurant_name", key: "restaurant_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.user_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách nhân viên</h1>
      <Button type="primary" onClick={() => setVisible(true)}>Thêm nhân viên</Button>
      {loading ? <Spin /> : <Table dataSource={dataSource} columns={columns} rowKey="user_id" />}
      
      <Modal
        title={editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
        open={visible}
        onCancel={resetForm}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true, message: "Nhập tên nhân viên" }]}> <Input /> </Form.Item>
          <Form.Item name="restaurant_name" label="Nhà hàng" rules={[{ required: true, message: "Nhập tên nhà hàng" }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}> <Input /> </Form.Item>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Nhập tên đăng nhập" }]}> <Input /> </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: !editingEmployee, message: "Nhập mật khẩu" }]}> <Input.Password /> </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}> 
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="STAFF">Nhân viên</Option>
            </Select> 
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default EmployeeList;
