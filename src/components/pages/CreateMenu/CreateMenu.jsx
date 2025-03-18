import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  Checkbox,
  message,
  Select,
  Card,
  Input,
} from "antd";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const { Option } = Select;

const CreateMenu = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector(selectUser);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get("/food");
      if (response?.data?.statusCode === 200) {
        setFoods(response.data.data);
      } else {
        message.error("Không thể lấy danh sách món ăn");
      }
    } catch (error) {
      message.error("Lỗi kết nối API khi lấy danh sách món ăn");
      console.error("Fetch Foods API Error:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (!user?.restaurantId) {
        message.error("Không tìm thấy thông tin nhà hàng");
        return;
      }

      if (!values.foodId) {
        message.error("Vui lòng chọn món ăn!");
        return;
      }

      // payload đúng format API yêu cầu
      const payload = {
        restaurantId: user.restaurantId,
        isActive: values.isActive || false,
        foodItems: [
          {
            foodId: values.foodId,
            price: values.price,
          },
        ],
      };

      console.log("Payload gửi đi:", payload);

      const response = await api.post("/menu", payload);
      if (response?.status === 200) {
        message.success("Tạo menu thành công!");
        alert("Tạo menu thành công!");
        form.resetFields();
      } else {
        message.error("Lỗi khi tạo menu!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối API!");
      console.error("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Tạo Menu Mới"
      bordered
      style={{ maxWidth: 500, margin: "auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Restaurant Name">
          <Input value={user?.name || ""} disabled />
        </Form.Item>

        <Form.Item
          label="Trạng thái hoạt động"
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox>Mở</Checkbox>
        </Form.Item>

        <Form.Item
          label="Món ăn"
          name="foodId"
          rules={[{ required: true, message: "Chọn món ăn" }]}
        >
          <Select placeholder="Chọn món ăn">
            {foods.map((food) => (
              <Option key={food.foodId} value={food.foodId}>
                {food.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Nhập giá món ăn" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo Menu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateMenu;
