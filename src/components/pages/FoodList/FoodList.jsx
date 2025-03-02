import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Layout,
  message,
  Select,
  Popconfirm,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import api from "../../config/axios";

const { Content } = Layout;
const { Option } = Select;

function FoodList() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ State lưu danh mục

  // 🛠 Lấy danh sách món ăn & danh mục khi component mount
  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  // 🛠 Lấy danh sách món ăn
  const fetchFoods = async () => {
    try {
      const response = await api.get("/food");
      if (response.data.statusCode === 200 && response.data.data) {
        setDataSource(response.data.data);
      } else {
        message.error(
          response.data.message || "Không thể lấy danh sách món ăn"
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
      message.error("Không thể lấy danh sách món ăn");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      if (res.data.statusCode === 200 && res.data.data) {
        setCategories(res.data.data);
      } else {
        message.error(res.data.message || "Không thể lấy danh mục");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      message.error("Không thể lấy danh mục");
    }
  };

  // 🛠 Thêm món mới vào API
  const handleSubmit = async (values) => {
    await form.validateFields();
    try {
      const newFood = {
        food_id: 0,
        name: values.name,
        description: values.description,
        image_url: values.image_url || null,
        category_id: values.category_id,
        status: "AVAILABLE",
      };

      const response = await api.post("/food", newFood, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.statusCode === 200) {
        setDataSource([...dataSource, response.data.data]);
        setVisible(false);
        form.resetFields();
        message.success("Thêm món ăn thành công!");
        alert("Thêm món ăn thành công!");
      } else {
        message.error(response.data.message || "Không thể thêm món ăn");
      }
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      message.error("Không thể thêm món ăn");
    }
  };

  // 🛠 Xóa món ăn
  const handleDelete = async (food_id) => {
    try {
      await api.delete(`/food/${food_id}`);
      setDataSource(dataSource.filter((item) => item.food_id !== food_id));
      alert("Xóa món ăn thành công!");
      fetchFoods(); // cập nhập lại món ăn
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      message.error("Không thể xóa món ăn");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
        <h1>Các món ăn của quán</h1>
        <Button type="primary" onClick={() => setVisible(true)}>
          Thêm món
        </Button>
        <Table
          dataSource={dataSource}
          columns={[
            { title: "Tên món", dataIndex: "name", key: "name" },
            { title: "Mô tả", dataIndex: "description", key: "description" },
            {
              title: "Hình ảnh",
              dataIndex: "image_url",
              key: "image_url",
              render: (image_url) =>
                image_url ? (
                  <img
                    src={image_url}
                    alt="Hình món ăn"
                    style={{ width: 50 }}
                  />
                ) : (
                  "Không có ảnh"
                ),
            },
            { title: "Danh mục", dataIndex: "category_id", key: "category_id" },
            { title: "Trạng thái", dataIndex: "status", key: "status" },
            {
              title: "Hành động",
              key: "action",
              render: (_, record) => (
                <Popconfirm
                  title="Xóa món ăn"
                  description="Bạn có chắc chắn muốn xóa món ăn này không?"
                  onConfirm={() => handleDelete(record.food_id)}
                >
                  <Button type="primary" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              ),
            },
          ]}
          rowKey="food_id"
        />

        <Modal
          title="Thêm món ăn"
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên món ăn"
              rules={[{ required: true, message: "Làm ơn hãy nhập tên món" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Làm ơn hãy nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="image_url" label="Hình ảnh">
              <Input placeholder="Nhập URL hình ảnh" />
            </Form.Item>
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: "Làm ơn hãy chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((category) => (
                  <Select.Option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default FoodList;
