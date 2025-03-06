import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Layout,
  message,
  Select,
  Popconfirm,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const { Content } = Layout;

function EmployeeList() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/user/get/all");
      if (response.data.statusCode === 200) {
        setDataSource(response.data.data);
      } else {
        message.error("Không thể lấy danh sách nhân viên");
      }
    } catch (error) {
      message.error("Lỗi kết nối API");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const employeeData = {
        ...values,
        password: editingEmployee ? undefined : values.password,
      };

      const response = editingEmployee
        ? await api.put(`/user/update/${editingEmployee.user_id}`, employeeData)
        : await api.post("/user/create", employeeData);

      if (response.data.statusCode === 200) {
        setDataSource((prev) =>
          editingEmployee
            ? prev.map((emp) => (emp.user_id === editingEmployee.user_id ? response.data.data : emp))
            : [...prev, response.data.data]
        );
        setVisible(false);
        setEditVisible(false);
        form.resetFields();
        message.success(editingEmployee ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên thành công!");
      } else {
        message.error("Không thể xử lý dữ liệu nhân viên");
      }
    } catch (error) {
      message.error("Lỗi khi gửi dữ liệu");
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await api.delete(`/user/delete/${user_id}`);
      setDataSource((prev) => prev.filter((emp) => emp.user_id !== user_id));
      message.success("Xóa nhân viên thành công!");
    } catch (error) {
      message.error("Không thể xóa nhân viên");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
        <h1>Danh sách nhân viên</h1>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          style={{ marginBottom: 10 }}
          icon={<PlusOutlined />}
        >
          Thêm nhân viên
        </Button>
        <Table
          dataSource={dataSource}
          columns={[
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
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setEditingEmployee(record);
                      form.setFieldsValue({ ...record, password: "" });
                      setEditVisible(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa nhân viên"
                    description="Bạn có chắc chắn muốn xóa nhân viên này không?"
                    onConfirm={() => handleDelete(record.user_id)}
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>Xóa</Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          rowKey="user_id"
        />

        {/* Modal thêm nhân viên */}
        <Modal
          title="Thêm nhân viên"
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true, message: "Nhập tên nhân viên" }]}> <Input /> </Form.Item>
            <Form.Item name="restaurant_id" label="Nhà hàng" rules={[{ required: true, message: "Nhập ID nhà hàng" }]}> <Input /> </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}> <Input /> </Form.Item>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Nhập tên đăng nhập" }]}> <Input /> </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Nhập mật khẩu" }]}> <Input.Password /> </Form.Item>
            <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}> 
              <Select>
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="STAFF">Nhân viên</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chỉnh sửa nhân viên */}
        <Modal
          title="Chỉnh sửa nhân viên"
          open={editVisible}
          onCancel={() => setEditVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="name" label="Tên nhân viên"> <Input /> </Form.Item>
            <Form.Item name="restaurant_id" label="Nhà hàng"> <Input /> </Form.Item>
            <Form.Item name="email" label="Email"> <Input /> </Form.Item>
            <Form.Item name="username" label="Tên đăng nhập"> <Input /> </Form.Item>
            <Form.Item name="role" label="Vai trò"> 
              <Select>
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="STAFF">Nhân viên</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default EmployeeList;
