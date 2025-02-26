import React, { useEffect, useState } from "react";
import { Input, Card, Button, Row, Col, Badge, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const { Search } = Input;

function MenuPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);

  // Lấy danh sách món ăn từ API
  const fetchMenuData = async () => {
    try {
      const res = await api.get("/food");
      if (res.status === 200 && res.data.data) {
        setMenuData(res.data.data);
      } else {
        message.error("Không thể lấy dữ liệu món ăn!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Thêm món vào giỏ hàng
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    message.success(`${item.name} đã thêm vào giỏ hàng!`);
  };

  // Lọc món ăn theo từ khóa tìm kiếm
  const filteredMenu = menuData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "10px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ color: "black", margin: 0 }}>Thực Đơn</h2>
        <Badge count={cart.length} showZero>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => (window.location.href = "/cart")}
            size="small"
          >
            Giỏ Hàng
          </Button>
        </Badge>
      </div>

      {/* Tìm kiếm */}
      <Search
        placeholder="Tìm món ăn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Danh sách món ăn */}
      <Row gutter={[8, 8]}>
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <Col xs={12} sm={12} md={8} key={item.food_id}>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                cover={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "150px",
                      backgroundColor: "#f8f8f8",
                    }}
                  >
                    <img
                      alt={item.name}
                      // src={item.image_url}
                      src={"./img/lauchay.png"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0",
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </span>
                  }
                  description={
                    <div>
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        {item.description}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#fa541c",
                          fontWeight: "bold",
                        }}
                      >
                        {item.price.toLocaleString()} đ
                      </p>
                    </div>
                  }
                />
                <Button
                  type="primary"
                  block
                  onClick={() => addToCart(item)}
                  style={{
                    marginTop: "10px",
                    borderRadius: "5px",
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            Không tìm thấy món ăn nào!
          </p>
        )}
      </Row>
    </div>
  );
}

export default MenuPage;
