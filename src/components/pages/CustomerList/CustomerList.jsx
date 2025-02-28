import { Button, Form, Input, Modal, Table, Layout, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import axios from "axios";

const { Content } = Layout;
const API_URL = "http://localhost:8080/api/customer"; // 🔥 Cập nhật API từ Swagger

function CustomerList() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 📌 Lấy danh sách khách hàng từ API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      setDataSource(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      message.error("Không thể lấy danh sách khách hàng");
    }
  };

  // 📌 Xử lý thêm khách hàng
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/create`, values);
      setDataSource([...dataSource, response.data]);
      setVisible(false);
      form.resetFields();
      message.success("Thêm khách hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
      message.error("Không thể thêm khách hàng");
    }
  };

  // 📌 Xử lý xóa khách hàng
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setDataSource(dataSource.filter((item) => item.id !== id));
      message.success("Xóa khách hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      message.error("Không thể xóa khách hàng");
    }
  };

  const columns = [
    { title: "Tên khách hàng", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Tổng tiền đã dùng",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách khách hàng</h1>
      <Button type="primary" onClick={() => setVisible(true)}>
        Thêm khách hàng
      </Button>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
      <Modal
        title="Thêm khách hàng"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên khách hàng"
            rules={[{ required: true, message: "Nhập tên khách hàng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="totalSpent"
            label="Tổng tiền đã dùng"
            rules={[{ required: true, message: "Nhập tổng tiền" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default CustomerList;
