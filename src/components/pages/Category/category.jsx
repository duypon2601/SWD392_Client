import {
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Button,
  message,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";

function CategoryManagement() {
  const [Categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      if (res.data.statusCode === 200 && res.data.data) {
        setCategories(res.data.data);
        console.log("Categories", res.data.data);
      } else {
        message.error(res.data.message || "Không thể lấy danh mục");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      message.error("Không thể lấy danh mục");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/category/${categoryId}`);
      message.success("Xóa danh mục thành công!");
      alert("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      message.error("Xóa danh mục thất bại");
    }
  };

  const showAddModal = () => {
    setIsAddingNew(true);
    setEditingCategory(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      await api.post("/category", values);
      message.success("Thêm danh mục thành công!");
      alert("Thêm danh mục thành công!");
      setOpenModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      message.error("Thêm danh mục thất bại");
    }
  };

  const showEditModal = (category) => {
    setIsAddingNew(false);
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
    });
    setOpenModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/category/${editingCategory.category_id}`, values);
      message.success("Cập nhật danh mục thành công!");
      alert("Cập nhật danh mục thành công!");
      setOpenModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      message.error("Cập nhật danh mục thất bại");
    }
  };

  const handleModalOk = () => {
    if (isAddingNew) {
      handleAddCategory();
    } else {
      handleUpdateCategory();
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setEditingCategory(null);
    setIsAddingNew(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    // { title: "ID", dataIndex: "category_id", key: "category_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex"}}>
          <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            style={{ marginRight: 5 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDeleteCategory(record.category_id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          thêm món mới
        </Button>
      </div>

      <Table dataSource={Categories} columns={columns} rowKey="category_id" />

      <Modal
        title={isAddingNew ? "Thêm danh mục mới" : "Cập nhật danh mục"}
        open={openModal}
        onOk={handleModalOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CategoryManagement;
