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
  const [loading, setLoading] = useState({
    table: true, // Loading cho bảng khi fetch lần đầu
    submit: false, // Loading cho nút OK trong modal
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form] = Form.useForm();
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
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
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const handleAddOrEditTable = async (values) => {
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const payload = {
        status: values.status,
        restaurantId: user?.restaurantId,
      };
      if (editingTable) {
        const response = await api.put(
          `/dining_table/${editingTable.id}`,
          values
        );
        setTables((prev) =>
          prev.map((item) =>
            item.id === editingTable.id ? response.data.data : item
          )
        );
        message.success("Cập nhật bàn ăn thành công!");
      } else {
        const response = await api.post("/dining_table", payload);
        setTables((prev) => [...prev, response.data.data]);
        message.success("Thêm bàn ăn thành công!");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi xử lý bàn ăn!");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDeleteTable = async (id) => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      await api.delete(`/dining_table/${id}`);
      setTables((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa bàn ăn thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa bàn ăn!");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
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
            <Button danger type="primary" loading={loading.table}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 10 }}
      >
        Thêm bàn ăn
      </Button>
      <Table
        dataSource={tables}
        columns={columns}
        rowKey="id"
        loading={loading.table} // Chỉ loading bảng khi fetch hoặc xóa
      />

      <Modal
        title={editingTable ? "Sửa bàn ăn" : "Thêm bàn ăn"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading.submit} // Chỉ loading nút OK
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditTable}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái!" }]}
          >
            <Input value="AVAILABLE" disabled />
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
