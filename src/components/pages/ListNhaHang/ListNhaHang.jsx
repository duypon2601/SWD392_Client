import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import api from "../../config/axios";

const { Content } = Layout;

function ListNhaHang() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("restaurant/get");
      if (response.data && Array.isArray(response.data.data)) {
        setDataSource(response.data.data);
      } else {
        setDataSource([]);
      }
    } catch (error) {
      message.error("Không thể lấy danh sách nhà hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setModalLoading(true);
    try {
      if (editingBranch) {
        await api.put(`restaurant/${editingBranch.restaurant_id}`, values);
        message.success("Cập nhật chi nhánh thành công!");
      } else {
        await api.post("restaurant/create", values);
        message.success("Thêm chi nhánh thành công!");
      }
      resetForm();
      fetchBranches();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return message.error("ID không hợp lệ!");

    const url = `restaurant/${id}`; // Kiểm tra Swagger để đảm bảo URL chính xác
    console.log("Gọi API xóa:", url);

    try {
      const response = await api.delete(url);
      if (response.status === 200) {
        setDataSource((prev) => prev.filter((item) => item.restaurant_id !== id));
        message.success("Xóa chi nhánh thành công!");
      } else {
        message.error("Không thể xóa chi nhánh!");
      }
    } catch (error) {
      console.error("Lỗi API:", error.response ? error.response.data : error);
      if (error.response) {
        if (error.response.status === 404) {
          message.error("Chi nhánh không tồn tại hoặc API sai đường dẫn!");
        } else if (error.response.status === 403) {
          message.error("Bạn không có quyền xóa!");
        } else {
          message.error("Lỗi không xác định, thử lại sau!");
        }
      } else {
        message.error("Lỗi kết nối API!");
      }
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

      <Modal title={editingBranch ? "Chỉnh sửa Chi Nhánh" : "Thêm Chi Nhánh"} open={visible} confirmLoading={modalLoading} onCancel={resetForm} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Tên Chi Nhánh" rules={[{ required: true, message: "Nhập tên chi nhánh" }]}> <Input /> </Form.Item>
          <Form.Item name="location" label="Địa Chỉ" rules={[{ required: true, message: "Nhập địa chỉ" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default ListNhaHang;
