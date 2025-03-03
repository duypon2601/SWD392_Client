import React, { useEffect, useState } from "react";
import {
  Input,
  Card,
  Button,
  Row,
  Col,
  message,
  Layout,
  Tabs,
  Typography,
  FloatButton,
  Modal,
  Space,
  Divider,
} from "antd";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import "./MenuPage.css";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

function MenuPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [searchVisible, setSearchVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuData();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      if (res.status === 200 && res.data.data) {
        setCategories(res.data.data);
      } else {
        message.error("Không thể lấy danh mục!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    message.success(`${item.name} đã thêm vào giỏ hàng!`);
  };
  const filteredMenu = menuData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showCart = () => {
    if (cart.length === 0) {
      message.info("Giỏ hàng của bạn đang trống");
      return;
    }
    navigate("/cart"); // Điều hướng đến trang giỏ hàng
    const totalAmount = cart.reduce(
      (total, item) => total + (item.price || 0),
      0
    );

    Modal.info({
      title: "🛒 Giỏ hàng của bạn",
      width: 350,
      content: (
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {cart.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <Space>
                <img
                  src={item.image_url || "./img/lauchay.png"}
                  alt={item.name}
                  className="cart-image"
                />
                <div>
                  <Text strong>{item.name}</Text>
                  <Text style={{ display: "block" }}>
                    {item.price?.toLocaleString() || 0} đ
                  </Text>
                </div>
              </Space>
              <Divider style={{ margin: "8px 0" }} />
            </div>
          ))}
          <Text strong className="cart-total">
            Tổng cộng: {totalAmount.toLocaleString()} đ
          </Text>
        </div>
      ),
      okText: "Thanh toán",
      onOk: () => {
        window.location.href = "/cart";
      },
    });
  };

  return (
    <Layout className="mcdonalds-theme">
      {/* Header với logo và thanh tìm kiếm */}
      <Header className="header">
        <img src="./img/mcdonalds-logo.png" alt="McDonald's" className="logo" />
        <Search
          placeholder="🔍 Tìm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </Header>

      {/* Tabs danh mục món ăn */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        className="menu-tabs"
      >
        {categories.map((category) => (
          <TabPane tab={category.name} key={String(category.category_id)} />
        ))}
      </Tabs>

      <Content className="menu-container">
        <Row gutter={[16, 16]}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <Col xs={12} sm={8} md={6} key={item.food_id}>
                <Card className="food-card" hoverable>
                  <img
                    src={item.image_url || "./img/lauchay.png"}
                    alt={item.name}
                    className="food-image"
                  />
                  <div className="food-info">
                    <Text strong className="food-name">
                      {item.name}
                    </Text>
                    <Text className="food-price">
                      {item.price?.toLocaleString()} đ
                    </Text>
                    <Button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Text strong style={{ textAlign: "center", width: "100%" }}>
              😢 Không tìm thấy món ăn nào!
            </Text>
          )}
        </Row>
      </Content>

      {/* Nút giỏ hàng nổi */}
      <FloatButton
        icon={<ShoppingCartOutlined />}
        badge={{ count: cart.length }}
        onClick={showCart}
      />
    </Layout>
  );
}

export default MenuPage;
