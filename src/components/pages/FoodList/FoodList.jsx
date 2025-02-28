import { Button, Form, Input, Modal, Table, Upload, Layout, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { Content } = Layout;
const API_URL = "https://your-api-url.com/foods"; // 🔥 Thay bằng API thật

function FoodList() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // 🛠 Lấy danh sách món ăn từ API khi component được mount
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      setDataSource(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
      message.error("Không thể lấy danh sách món ăn");
    }
  };

  // 🛠 Thêm món mới vào API
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("Tenmon", values.Tenmon);
      formData.append("Gia", values.Gia);
      formData.append("image", values.image?.fileList?.[0]?.originFileObj);

      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setDataSource([...dataSource, response.data]);
      setVisible(false);
      form.resetFields();
      message.success("Thêm món ăn thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      message.error("Không thể thêm món ăn");
    }
  };

  // 🛠 Xóa món ăn khỏi API
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDataSource(dataSource.filter(item => item.id !== id));
      message.success("Xóa món ăn thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      message.error("Không thể xóa món ăn");
    }
  };

  const columns = [
    { title: 'Tên món', dataIndex: 'Tenmon', key: 'Tenmon' },
    { title: 'Giá', dataIndex: 'Gia', key: 'Gia' },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <img src={image} alt="Hình món ăn" style={{ width: 50 }} /> : 'Không có ảnh',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: '20px', background: '#fff', flex: 1 }}>
        <h1>Các món ăn của quán</h1>
        <Button type="primary" onClick={() => setVisible(true)}>Thêm món</Button>
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
        <Modal title="Thêm món ăn" open={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()}>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="Tenmon" label="Tên món ăn" rules={[{ required: true, message: "Làm ơn hãy nhập tên món" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Gia" label="Giá tiền" rules={[{ required: true, message: "Làm ơn hãy nhập giá tiền" }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="image" label="Hình ảnh" rules={[{ required: true, message: "Làm ơn hãy tải lên hình ảnh" }]}>
              <Upload beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default FoodList;
