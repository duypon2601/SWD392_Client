import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Typography,
} from "antd";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const { Option } = Select;

function CreateTable() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form] = Form.useForm();
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await api.get(`dining_table/restaurant/${user.restaurantId}`);
      if (res.status === 200) {
        setTables(res.data.data);
        console.log("bàndddddddddddd:", res.data.data);
      } else {
        message.error("Không thể lấy danh sách bàn ăn!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditTable = async (values) => {
    try {
      const payload = {
        status: values.status,
        restaurantId: user?.restaurantId,
      };
      if (editingTable) {
        await api.put(`/dining_table/${editingTable.id}`, values);
        message.success("Cập nhật bàn ăn thành công!");
      } else {
        await api.post("/dining_table", payload);
        message.success("Thêm bàn ăn thành công!");
      }
      setModalVisible(false);
      form.resetFields();
      fetchTables();
    } catch (error) {
      message.error("Lỗi khi xử lý bàn ăn!");
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await api.delete(`/dining_table/${id}`);
      message.success("Xóa bàn ăn thành công!");
      fetchTables();
    } catch (error) {
      message.error("Lỗi khi xóa bàn ăn!");
    }
  };

  const openModal = (table = null) => {
    setEditingTable(table);
    setModalVisible(true);
    if (table) {
      form.setFieldsValue(table);
    } else {
      form.setFieldsValue({
        status: "AVAILABLE",
        restaurantId: user?.restaurantId,
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "QR Code", dataIndex: "qrCode", key: "qrCode" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Mã nhà hàng", dataIndex: "restaurantId", key: "restaurantId" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn?"
            onConfirm={() => handleDeleteTable(record.id)}
          >
            <Button danger type="primary">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 10}}>
        Thêm bàn ăn
      </Button>
      <Table
        dataSource={tables}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingTable ? "Sửa bàn ăn" : "Thêm bàn ăn"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditTable}>
          {/* <Form.Item
            name="qrCode"
            label="QR Code"
            rules={[{ required: true, message: "Nhập QR Code!" }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái!" }]}
          >
            <Input value="AVAILABLE" disabled />
            {/* <Select>
              <Option value="AVAILABLE">AVAILABLE</Option>
            </Select> */}
          </Form.Item>

          <Form.Item label="Mã nhà hàng">
            <Input value={user?.name} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateTable;
