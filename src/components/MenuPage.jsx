import React, { useState } from "react";
import { Input, Card, Button, Row, Col, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Search } = Input;

const menuData = [
  {
    id: 1,
    name: "Lẩu Ếch Măng Chua",
    price: 89000,
    image: "/img/lauechmang.png",
    
  },
  {
    id: 2,
    name: "Lẩu Cá Hú",
    price: 79000,
    image: "/img/laucahu.png",
  },
  {
    id: 3,
    name: "Lẩu Đầu Cá Hồi",
    price: 79000,
    image: "/img/laucahoi.png",
  },
  {
    id: 4,
    name: "Lẩu Tôm Càng Xanh",
    price: 99000,
    image: "/img/tomcang.png",
  },
  {
    id: 5,
    name: "Lẩu Thái Hải Sản",
    price: 89000,
    image: "/img/lauthai.png",
  },
  {
    id: 6,
    name: "Lẩu Nấm Chay",
    price: 79000,
    image: "/img/lauchay.png",
  },
  {
    id: 7,
    name: "Lẩu Gà Lá Giang",
    price: 99000,
    image: "/img/laulagiang.png",
  },
  {
    id: 8,
    name: "Lẩu Bò Nhúng Dấm",
    price: 109000,
    image: "/img/launhunggiam.png",
  },
  {
    id: 9,
    name: "Lẩu Cá Lăng",
    price: 95000,
    image: "/img/laucalang.png",
  },
  {
    id: 10,
    name: "Lẩu Tôm Sú",
    price: 119000,
    image: "/img/lautomsu.png",
  },
  {
    id: 11,
    name: "Lẩu Sườn Non",
    price: 89000,
    image: "/img/lausuonnon.png",
  },
  {
    id: 12,
    name: "Lẩu Gà Ớt Hiểm",
    price: 99000,
    image: "/img/laugaothiem.png",
  },
];

function MenuPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm thêm món ăn vào giỏ
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]); // Dùng hàm callback để tránh vấn đề với state bất đồng bộ
  };

  // Lọc các món ăn dựa trên từ khóa tìm kiếm
  const filteredMenu = menuData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "black" }}>Thực Đơn</h1>
        <Badge count={cart.length} showZero>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => (window.location.href = "/cart")}
          >
            Giỏ Hàng
          </Button>
        </Badge>
      </div>

      {/* Search */}
      <Search
        placeholder="Tìm món ăn"
        onSearch={(value) => setSearchTerm(value)}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      {/* Menu Items */}
      <Row gutter={[16, 16]}>
        {filteredMenu.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "170px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    alt={item.name}
                    src={item.image}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
              actions={[
                <Button
                  key="add-to-cart"
                  type="primary"
                  onClick={() => addToCart(item)}
                >
                  Thêm vào giỏ
                </Button>,
              ]}
            >
              <Card.Meta
                title={item.name}
                description={`${item.price.toLocaleString()} đ`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MenuPage;
