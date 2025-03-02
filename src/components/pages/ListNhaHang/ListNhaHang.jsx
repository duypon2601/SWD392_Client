import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";

const ListNhaHang = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success("Chi nhánh đã được tạo thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <Card title="Tạo Chi Nhánh Mới" style={{ maxWidth: 500, margin: "auto", marginTop: 20 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên Chi Nhánh"
          name="branchName"
          rules={[{ required: true, message: "Vui lòng nhập tên chi nhánh!" }]}
        >
          <Input placeholder="Nhập tên chi nhánh" />
        </Form.Item>

        <Form.Item
          label="Địa Chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Số Điện Thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^\d{10,11}$/, message: "Số điện thoại không hợp lệ!" }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo Chi Nhánh
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ListNhaHang;