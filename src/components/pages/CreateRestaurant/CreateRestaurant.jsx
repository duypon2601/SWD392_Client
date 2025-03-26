import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space } from "antd";
import api from "../../config/axios"; // Đường dẫn API của bạn
import { EditOutlined } from "@ant-design/icons";

function CreateRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [editingRestaurant, setEditingRestaurant] = useState(null); 
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 🟢 Lấy danh sách nhà hàng
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/restaurant/get");
      if (res.status === 200) {
        setRestaurants(res.data.data);
      } else {
        message.error("Không thể tải danh sách nhà hàng!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Mở modal thêm/sửa nhà hàng
  const openModal = (restaurant = null) => {
    setEditingRestaurant(restaurant);
    form.setFieldsValue(restaurant || { name: "", location: "" });
    setModalVisible(true);
  };

  // 🟢 Gửi dữ liệu để thêm/sửa nhà hàng
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRestaurant) {
        // Sửa nhà hàng
        await api.put(`/restaurant/${editingRestaurant.restaurantId}`, values);
        message.success("Cập nhật nhà hàng thành công!");
        alert: "submit thành công";
      } else {
        // Thêm mới nhà hàng
        await api.post("/restaurant/create", { ...values, restaurantId: 0 });
        message.success("Thêm nhà hàng thành công!");
      }
      fetchRestaurants(); // Load lại danh sách
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi lưu nhà hàng!");
      console.error("API Error:", error);
    }
  };

  //  Xóa nhà hàng
  const handleDelete = async (restaurantId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa nhà hàng này không?",
      onOk: async () => {
        try {
          await api.delete(`/restaurant/${restaurantId}`);
          message.success("Xóa nhà hàng thành công!");
          fetchRestaurants();
        } catch (error) {
          message.error("Lỗi khi xóa nhà hàng!");
          console.error("API Error:", error);
        }
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => openModal()}>
        + Thêm Nhà Hàng
      </Button>

      {/* Bảng danh sách nhà hàng */}
      <Table
        dataSource={restaurants}
        rowKey="restaurantId"
        loading={loading}
        style={{ marginTop: 10 }}
      >
        <Table.Column title="ID" dataIndex="restaurantId" key="restaurantId" />
        <Table.Column title="Tên Nhà Hàng" dataIndex="name" key="name" />
        <Table.Column title="Địa Điểm" dataIndex="location" key="location" />
        <Table.Column
          title="Hành Động"
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                onClick={() => openModal(record)}
                type="primary"
                icon={<EditOutlined />}
              >
                Sửa
              </Button>
              <Button
                onClick={() => handleDelete(record.restaurantId)}
                type="primary"
                danger
              >
                Xóa
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Modal Thêm/Sửa Nhà Hàng */}
      <Modal
        title={editingRestaurant ? "Chỉnh sửa nhà hàng" : "Thêm nhà hàng"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên Nhà Hàng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa Điểm"
            name="location"
            rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateRestaurant;
