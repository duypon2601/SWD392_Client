import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  InputNumber,
  message,
  Card,
  Typography,
  Space,
} from "antd";
import api from "../../config/axios";

const { Title } = Typography;

const AddMenu = () => {
  const [foodList, setFoodList] = useState([]);
  const [selectedFood, setSelectedFood] = useState({});

  useEffect(() => {
    fetchFoodList();
  }, []);

  const fetchFoodList = async () => {
    try {
      const response = await api.get("/food");
      console.log("API response:", response.data.data);
      setFoodList(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      message.error("Failed to fetch food list");
      setFoodList([]);
    }
  };

  const handlePriceChange = (foodId, value) => {
    setSelectedFood((prev) => ({
      ...prev,
      [foodId]: { ...prev[foodId], price: value || 0 },
    }));
  };

  const addToMenu = async (foodId) => {
    const foodItem = selectedFood[foodId];
    if (!foodItem || foodItem.quantity <= 0 || foodItem.price <= 0) {
      message.warning("Please enter valid price and quantity");
      return;
    }

    try {
      await api.post("/menu", {
        foodItems: [
          {
            foodId,
            price: foodItem.price,
            quantity: foodItem.quantity,
          },
        ],
      });
      message.success("Added to menu successfully");
    } catch (error) {
      message.error("Failed to add food to menu");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (url) => (
        <img
          src={url || "https://via.placeholder.com/60"}
          alt="food"
          width={60}
          height={60}
          style={{
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong style={{ color: "#1890ff" }}>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span style={{ fontStyle: "italic" }}>{text}</span>,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <InputNumber
          min={0}
          onChange={(value) => handlePriceChange(record.food_id, value)}
          placeholder="Enter price"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => addToMenu(record.food_id)}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Add to Menu
        </Button>
      ),
    },
  ];

  return (
    <Card
      style={{
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        background: "#f9f9f9",
      }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
      >
        🍽️ Create Menu
      </Title>
      <Table
        dataSource={foodList || []}
        columns={columns}
        rowKey="food_id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Card>
  );
};

export default AddMenu;
