import { Button, Form, Input, Modal, Table, Layout, message, Popconfirm, Spin, Upload, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;

function ListNhaHang() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Load dữ liệu nhà hàng từ localStorage
    const savedData = localStorage.getItem("branches");
    if (savedData) {
      setDataSource(JSON.parse(savedData));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("branches", JSON.stringify(data));
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    form.setFieldsValue(branch);
    setVisible(true);

    // Load ảnh từ localStorage nếu có
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

  const handleSubmit = async (values) => {
    const newBranch = {
      name: values.name,
      location: values.location,
      image: values.image || (fileList[0]?.url ?? ""),
    };

    if (editingBranch) {
      const updatedData = dataSource.map((branch) =>
        branch.restaurant_id === editingBranch.restaurant_id ? { ...branch, ...newBranch } : branch
      );
      setDataSource(updatedData);
      saveToLocalStorage(updatedData);
      message.success("Cập nhật thành công!");
    } else {
      const newData = [...dataSource, { ...newBranch, restaurant_id: Date.now() }];
      setDataSource(newData);
      saveToLocalStorage(newData);
      message.success("Thêm thành công!");
    }
    resetForm();
  };

  const handleDelete = (id) => {
    const updatedData = dataSource.filter((branch) => branch.restaurant_id !== id);
    setDataSource(updatedData);
    saveToLocalStorage(updatedData);
    message.success("Xóa chi nhánh thành công!");
  };

  const handleUpload = async ({ file }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setFileList([{ url: base64Image }]);
      form.setFieldsValue({ image: base64Image });
    };
  };

  return (
    <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
      <h1>Danh sách Chi Nhánh</h1>
      <Button type="primary" onClick={() => setVisible(true)}>Thêm Chi Nhánh</Button>
      {loading ? <Spin /> : <Table dataSource={dataSource} columns={[
        { title: "Hình Ảnh", dataIndex: "image", key: "image", render: (text) => text ? <Image width={50} src={text} /> : "Không có ảnh" },
        { title: "Tên Chi Nhánh", dataIndex: "name", key: "name" },
        { title: "Địa Chỉ", dataIndex: "location", key: "location" },
        {
          title: "Hành động", key: "action", render: (_, record) => (
            <>
              <Button type="primary" style={{ marginRight: "5px" }} onClick={() => openEditModal(record)}>Sửa</Button>
              <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.restaurant_id)} okText="Xóa" cancelText="Hủy">
                <Button type="primary" danger>Xóa</Button>
              </Popconfirm>
            </>
          )
        }
      ]} rowKey="restaurant_id" />}
      
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
