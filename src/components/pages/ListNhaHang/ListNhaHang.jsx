import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import api from "../../config/axios";

const { Content } = Layout;

function ListNhaHang() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/restaurant/get");
      console.log("Dữ liệu từ API:", response.data);
      if (response.data.statusCode === 200) {
        setDataSource(response.data.data);
      } else {
        message.error("Không thể lấy danh sách nhà hàng!");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    console.log("Dữ liệu gửi đi:", values);
    try {
      const newBranch = { name: values.name, location: values.location };
      let response;
  
      if (editingBranch) {
        response = await api.put(`/restaurant/${editingBranch.restaurant_id}`, newBranch);
      } else {
        response = await api.post("/restaurant/create", newBranch);
      }
  
      console.log("Phản hồi API:", response.data);
      
      if (response.data.statusCode === 200) {
        message.success(editingBranch ? "Cập nhật thành công!" : "Thêm thành công!");

        if (editingBranch) {
          // Cập nhật chi nhánh trong danh sách
          setDataSource((prev) =>
            prev.map((b) =>
              b.restaurant_id === editingBranch.restaurant_id ? { ...b, ...newBranch } : b
            )
          );
          
        } else {
          // Thêm mới lên đầu danh sách
          setDataSource([response.data.data, ...dataSource]);
        }

        resetForm();
      } else {
        message.error(response.data.message || "Lỗi xử lý dữ liệu!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      message.error("Không thể kết nối API!");
    }
  };

  const handleDelete = async (id) => {
    console.log("ID cần xóa:", id);
    try {
      const response = await api.delete(`/restaurant/${id}`);
      console.log("Phản hồi khi xóa:", response.data);
      if (response.data.statusCode === 200) {
        message.success("Xóa chi nhánh thành công!");
        setDataSource(dataSource.filter((item) => item.restaurant_id !== id));
      } else {
        message.error("Không thể xóa chi nhánh!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      message.error("Lỗi khi xóa chi nhánh!");
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    form.setFieldsValue(branch);
    setVisible(true);
  };

  const resetForm = () => {
    form.resetFields();
    setEditingBranch(null);
    setVisible(false);
  };

  const columns = [
    { title: "Tên Chi Nhánh", dataIndex: "name", key: "name" },
    { title: "Địa Chỉ", dataIndex: "location", key: "location" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: "5px" }} onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.restaurant_id)} okText="Xóa" cancelText="Hủy">
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách Chi Nhánh</h1>
      <Button type="primary" onClick={() => setVisible(true)}>Thêm Chi Nhánh</Button>
      {loading ? <Spin /> : <Table dataSource={dataSource} columns={columns} rowKey="restaurant_id" />}

      <Modal 
        title={editingBranch ? "Chỉnh sửa Chi Nhánh" : "Thêm Chi Nhánh"} 
        open={visible} 
        onCancel={resetForm} 
        onOk={() => form.validateFields().then(handleSubmit).catch(() => {})}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên Chi Nhánh" 
            rules={[{ required: true, message: "Nhập tên chi nhánh" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="location" 
            label="Địa Chỉ" 
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default ListNhaHang;
