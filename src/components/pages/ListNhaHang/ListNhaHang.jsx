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
  const [loading, setLoading] = useState({
    table: true, // Loading cho bảng khi fetch lần đầu
    submit: false, // Loading cho nút OK trong modal
  });
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);

  // Lấy danh sách nhà hàng từ API
  const fetchBranches = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      const response = await api.get("/restaurant/get");
      if (response.status === 200) {
        setDataSource(response.data.data);
      } else {
        message.error("Không thể lấy danh sách nhà hàng!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("Lỗi API:", error);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
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

  // Gửi API thêm/sửa chi nhánh và cập nhật danh sách mà không load lại
  const handleSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      const values = await form.validateFields();
      let updatedData;
      if (editingBranch) {
        // Cập nhật chi nhánh
        const response = await api.put(
          `/restaurant/${editingBranch.restaurantId}`,
          values
        );
        updatedData = response.data.data; // Giả sử API trả về dữ liệu chi nhánh đã cập nhật
        setDataSource((prev) =>
          prev.map((item) =>
            item.restaurantId === editingBranch.restaurantId
              ? updatedData
              : item
          )
        );
        message.success("Cập nhật nhà hàng thành công!");
      } else {
        // Thêm chi nhánh mới
        const response = await api.post("/restaurant/create", {
          ...values,
          restaurantId: 0,
        });
        updatedData = response.data.data; // Giả sử API trả về dữ liệu chi nhánh mới
        setDataSource((prev) => [...prev, updatedData]);
        message.success("Thêm nhà hàng thành công!");
      }
      resetForm();
    } catch (error) {
      message.error("Lỗi khi lưu nhà hàng!");
      console.error("API Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Xóa chi nhánh
  const handleDelete = async (id) => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      await api.delete(`/restaurant/${id}`);
      setDataSource((prev) => prev.filter((item) => item.restaurantId !== id));
      message.success("Xóa nhà hàng thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa nhà hàng!");
      console.error("API Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      {loading.table ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Button
            type="primary"
            onClick={() => setVisible(true)}
            icon={<PlusOutlined />}
          >
            Thêm Chi Nhánh
          </Button>
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
                    <Button
                      type="primary"
                      onClick={() => openEditModal(record)}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xác nhận xóa"
                      description="Bạn có chắc chắn muốn xóa nhà hàng này không?"
                      onConfirm={() => handleDelete(record.restaurantId)}
                    >
                      <Button
                        type="primary"
                        danger
                        loading={loading.table} // Loading cho nút "Xóa" khi xóa
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            rowKey="restaurantId"
            style={{ marginTop: 20 }}
            loading={loading.table} // Loading cho bảng
          />
          <Modal
            title={editingBranch ? "Chỉnh sửa Chi Nhánh" : "Thêm Chi Nhánh"}
            open={visible}
            onCancel={resetForm}
            onOk={handleSubmit}
            confirmLoading={loading.submit} // Chỉ loading cho nút OK
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
                    message:
                      "Tên chi nhánh chỉ được chứa chữ cái và khoảng trắng!",
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
                  {
                    max: 100,
                    message: "Địa chỉ không được vượt quá 100 ký tự!",
                  },
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
        </>
      )}
    </Content>
  );
}

export default ListNhaHang;
