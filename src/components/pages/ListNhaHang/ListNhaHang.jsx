import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Layout,
  message,
  Popconfirm,
  Spin,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const { Content } = Layout;

function ListNhaHang() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);

  // Lấy danh sách nhà hàng từ API
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/restaurant/get");
      if (response.status === 200) {
        setDataSource(response.data.data);
      } else {
        message.error("Không thể lấy danh sách nhà hàng!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Mở modal chỉnh sửa
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

  // Gửi API thêm/sửa chi nhánh
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBranch) {
        await api.put(`/restaurant/${editingBranch.restaurantId}`, values);
        message.success("Cập nhật nhà hàng thành công!");
      } else {
        await api.post("/restaurant/create", { ...values, restaurantId: 0 });
        message.success("Thêm nhà hàng thành công!");
      }
      fetchBranches();
      resetForm();
    } catch (error) {
      message.error("Lỗi khi lưu nhà hàng!");
    }
  };

  // Xóa chi nhánh
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa nhà hàng này không?",
      onOk: async () => {
        try {
          await api.delete(`/restaurant/${id}`);
          message.success("Xóa nhà hàng thành công!");
          fetchBranches();
        } catch (error) {
          message.error("Lỗi khi xóa nhà hàng!");
        }
      },
    });
  };

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <Button type="primary" onClick={() => setVisible(true)}>
        Thêm Chi Nhánh
      </Button>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={dataSource}
          columns={[
            { title: "ID", dataIndex: "restaurantId", key: "restaurantId" },
            { title: "Tên Chi Nhánh", dataIndex: "name", key: "name" },
            { title: "Địa Chỉ", dataIndex: "location", key: "location" },
            {
              title: "Hành động",
              key: "action",
              render: (_, record) => (
                <Space>
                  <Button type="primary" onClick={() => openEditModal(record)}>
                    Sửa
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(record.restaurantId)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="restaurantId"
        />
      )}
      <Modal
        title={editingBranch ? "Chỉnh sửa Chi Nhánh" : "Thêm Chi Nhánh"}
        open={visible}
        onCancel={resetForm}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Chi Nhánh"
            rules={[
              { required: true, message: "Nhập tên chi nhánh" },
              { min: 2, message: "Tên chi nhánh phải có ít nhất 2 ký tự!" },
              {
                max: 50,
                message: "Tên chi nhánh không được vượt quá 50 ký tự!",
              },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Tên chi nhánh chỉ được chứa chữ cái và khoảng trắng!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Địa Chỉ"
            rules={[
              { required: true, message: "Nhập địa chỉ" },
              { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!" },
              { max: 100, message: "Địa chỉ không được vượt quá 100 ký tự!" },
              {
                pattern: /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
                message:
                  "Địa chỉ chỉ được chứa chữ cái, số, khoảng trắng, dấu phẩy, dấu chấm và dấu gạch ngang!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default ListNhaHang;
