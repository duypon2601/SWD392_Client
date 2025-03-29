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

function CategoriManagement() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState({
    table: true, // Loading cho bảng khi fetch lần đầu
    submit: false, // Loading cho nút OK trong modal
  });
  const [form] = useForm();

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, table: true }));
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
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading((prev) => ({ ...prev, table: true }));
      await api.delete(`/category/${categoryId}`);
      setCategories((prev) =>
        prev.filter((item) => item.category_id !== categoryId)
      );
      message.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      message.error("Xóa danh mục thất bại");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const showAddModal = () => {
    setIsAddingNew(true);
    setEditingCategory(null);
    form.resetFields();
    setOpenModal(true);
  };

  const showEditModal = (category) => {
    setIsAddingNew(false);
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
    });
    setOpenModal(true);
  };

  const handleAddCategory = async () => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      const values = await form.validateFields();
      const response = await api.post("/category", values);
      const newCategory = response.data.data; // Giả sử API trả về danh mục mới
      setCategories((prev) => [...prev, newCategory]);
      message.success("Thêm danh mục thành công!");
      setOpenModal(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      message.error("Thêm danh mục thất bại");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      const values = await form.validateFields();
      const response = await api.put(
        `/category/${editingCategory.category_id}`,
        values
      );
      const updatedCategory = response.data.data; // Giả sử API trả về danh mục đã cập nhật
      setCategories((prev) =>
        prev.map((item) =>
          item.category_id === editingCategory.category_id
            ? updatedCategory
            : item
        )
      );
      message.success("Cập nhật danh mục thành công!");
      setOpenModal(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      message.error("Cập nhật danh mục thất bại");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
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
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
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
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                loading={loading.table} // Loading cho nút Delete khi xóa
              >
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
          Thêm danh mục mới
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="category_id"
        loading={loading.table} // Loading cho bảng khi fetch lần đầu hoặc xóa
      />

      <Modal
        title={isAddingNew ? "Thêm danh mục mới" : "Cập nhật danh mục"}
        open={openModal}
        onOk={handleModalOk}
        onCancel={handleCancel}
        confirmLoading={loading.submit} // Chỉ loading cho nút OK
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự!" },
              {
                max: 50,
                message: "Tên danh mục không được vượt quá 50 ký tự!",
              },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Tên danh mục chỉ được chứa chữ cái và khoảng trắng!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CategoriManagement;
