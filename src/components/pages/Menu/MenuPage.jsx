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
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import "./MenuPage.css";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/features/cartSlice";

const { Search } = Input;
const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuData();
    fetchCategories();
  }, []);

  const fetchMenuData = async (categoryId = null) => {
    try {
      const res = await api.get("/food");
      if (res.status === 200 && res.data.data) {
        setMenuData(res.data.data);
        if (categoryId) {
          setSelectedCategory(categoryId);
        }
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
        setSelectedCategory(res.data.data[0]?.category_id || null); // Chọn danh mục đầu tiên nếu có
      } else {
        message.error("Không thể lấy danh mục!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  // Khi nhấn vào tab danh mục, gọi lại API để cập nhật món ăn
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchMenuData(categoryId); // Load lại món ăn theo danh mục
  };

  // Lọc món ăn theo danh mục và từ khóa tìm kiếm
  const filteredMenu = menuData
    .filter(
      (item) =>
        selectedCategory === null || item.category_id === selectedCategory
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // const addToCart = (item) => {
  //   setCart((prevCart) => [...prevCart, item]);
  //   message.success(`${item.name} đã thêm vào giỏ hàng!`);
  // };

  // Điều hướng sang trang giỏ hàng
  const showCart = () => {
    if (cartcount.length === 0) {
      message.info("Giỏ hàng của bạn đang trống");
      return;
    }
    navigate("/cart");
  };

  const dispatch = useDispatch();

  // Then update your handler
  const handleAddToCart = (item) => {
    // setCart((prevCart) => [...prevCart, item]);
    dispatch(addProduct(item));
    message.success(`${item.name} đã thêm vào giỏ hàng!`);
  };

  // đếm sanr phẩm khi add vào giỏ hàng
  const cartcount = useSelector((state) => state.cart.items);

  return (
    <Layout className="mcdonalds-theme">
      {/* Header với logo và thanh tìm kiếm */}
      <Header className="header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJPsjc6b6gCibZVpcq235Jn-mdhT2nqLbKkQ&s"
          alt="McDonald's"
          className="logo"
        />
        <Search
          placeholder=" Tìm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </Header>

      {/* Tabs danh mục món ăn */}
      <Tabs
        activeKey={String(selectedCategory)}
        onChange={(key) => handleCategoryClick(Number(key))}
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
                    src={item.image_url}
                    alt={item.name}
                    className="food-image"
                  />
                  <div className="food-info">
                    <Text strong className="food-name">
                      {item.name}
                    </Text>
                    <div>
                      <Text className="food-description">
                        {item.description}
                      </Text>
                    </div>
                    <Button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Text strong style={{ textAlign: "center", width: "100%" }}>
              Không tìm thấy món ăn nào!
            </Text>
          )}
        </Row>
      </Content>

      {/* Nút giỏ hàng nổi */}
      <FloatButton
        icon={<ShoppingCartOutlined />}
        badge={{ count: cartcount.length }}
        onClick={showCart}
      />
    </Layout>
  );
}

export default MenuPage;
