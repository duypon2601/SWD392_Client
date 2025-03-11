import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin, Upload, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from '@ant-design/icons';
import api from "../../config/axios";

const { Content } = Layout;

// Thay bằng URL và preset của bạn
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const CLOUDINARY_PRESET_NAME = "YOUR_PRESET_NAME";

function ListNhaHang() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Lấy danh sách nhà hàng từ API
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/restaurant/get");
      if (response.data.statusCode === 200) {
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

    // Nếu có ảnh, hiển thị ảnh hiện tại
    if (branch.image) {
      setFileList([{ url: branch.image }]);
    } else {
      setFileList([]);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditingBranch(null);
    setVisible(false);
    setFileList([]);
  };

  // Xử lý upload lên Cloudinary
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET_NAME);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        setFileList([{ url: data.secure_url }]);
        form.setFieldsValue({ image: data.secure_url });
        message.success("Tải ảnh lên thành công!");
      } else {
        message.error("Lỗi khi tải ảnh lên Cloudinary!");
      }
    } catch (error) {
      message.error("Không thể upload ảnh!");
    }
  };

  // Gửi API thêm/sửa chi nhánh
  const handleSubmit = async (values) => {
    try {
      let response;
      const newBranch = {
        name: values.name,
        location: values.location,
        image: values.image || (fileList[0]?.url ?? ""),
      };

      if (editingBranch) {
        response = await api.put(`/restaurant/${editingBranch.restaurant_id}`, newBranch);
        if (response.data.statusCode === 200) {
          setDataSource((prev) =>
            prev.map((branch) =>
              branch.restaurant_id === editingBranch.restaurant_id ? { ...branch, ...newBranch } : branch
            )
          );
          message.success("Cập nhật thành công!");
        }
      } else {
        response = await api.post("/restaurant/create", newBranch);
        if (response.data.statusCode === 200) {
          setDataSource((prev) => [...prev, response.data.data]);
          message.success("Thêm thành công!");
        }
      }

      resetForm();
    } catch (error) {
      message.error("Không thể kết nối API!");
    }
  };

  // Xóa chi nhánh
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/restaurant/${id}`);
      if (response.data.statusCode === 200) {
        setDataSource((prev) => prev.filter((branch) => branch.restaurant_id !== id));
        message.success("Xóa chi nhánh thành công!");
      } else {
        message.error("Không thể xóa chi nhánh!");
      }
    } catch (error) {
      message.error("Lỗi khi xóa chi nhánh!");
    }
  };

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách Chi Nhánh</h1>
      <Button type="primary" onClick={() => setVisible(true)}>Thêm Chi Nhánh</Button>
      {loading ? <Spin /> : (
        <Table dataSource={dataSource} columns={[
          {
            title: "Hình Ảnh",
            dataIndex: "image",
            key: "image",
            render: (text) => text ? <Image width={50} src={text} /> : "Không có ảnh",
          },
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
        ]} rowKey="restaurant_id" />
      )}

      <Modal title={editingBranch ? "Chỉnh sửa Chi Nhánh" : "Thêm Chi Nhánh"} open={visible} onCancel={resetForm} onOk={() => form.validateFields().then(handleSubmit).catch(() => {})}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Chi Nhánh" rules={[{ required: true, message: "Nhập tên chi nhánh" }]}><Input /></Form.Item>
          <Form.Item name="location" label="Địa Chỉ" rules={[{ required: true, message: "Nhập địa chỉ" }]}><Input /></Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Upload listType="picture-card" showUploadList={false} customRequest={handleUpload}>
              {fileList.length > 0 ? <img src={fileList[0].url} alt="image" style={{ width: "100%" }} /> : <PlusOutlined />}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

export default ListNhaHang;
