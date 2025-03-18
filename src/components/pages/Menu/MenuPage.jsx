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
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/features/cartSlice";

const { Search } = Input;
const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]); // Danh sách món ăn
  const [categories, setCategories] = useState([]); // Danh mục
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuData();
    fetchCategories();
  }, []);

  // 📌 Lấy danh sách món ăn từ API
  const fetchMenuData = async () => {
    try {
      const res = await api.get("menu/restaurant/1");
      if (res.status === 200 && res.data.data.length > 0) {
        const menu = res.data.data[0]; // Lấy menu đầu tiên
        setMenuData(menu.menuItems || []); // Chỉ lấy danh sách món ăn
      } else {
        message.error("Không thể lấy dữ liệu món ăn!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  // 📌 Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      if (res.status === 200 && res.data.data) {
        setCategories(res.data.data);
        setSelectedCategory(res.data.data[0]?.name || null); // Chọn danh mục đầu tiên nếu có
      } else {
        message.error("Không thể lấy danh mục!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  // 📌 Khi chọn danh mục
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // 📌 Lọc món ăn theo danh mục (categoryName) và từ khóa tìm kiếm
  const filteredMenu = menuData
    .filter(
      (item) =>
        selectedCategory === null || item.categoryName === selectedCategory
    )
    .filter((item) =>
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // 📌 Điều hướng sang trang giỏ hàng
  const showCart = () => {
    if (cartcount.length === 0) {
      message.info("Giỏ hàng của bạn đang trống");
      return;
    }
    navigate("/cart");
  };

  // 📌 Thêm món vào giỏ hàng
  const dispatch = useDispatch();
  const handleAddToCart = (item) => {
    dispatch(addProduct(item));
    message.success(`${item.foodName} đã thêm vào giỏ hàng!`);
  };

  // 📌 Đếm sản phẩm trong giỏ hàng
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
          placeholder="Tìm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </Header>

      {/* Tabs danh mục món ăn */}
      <Tabs
        activeKey={selectedCategory}
        onChange={(key) => handleCategoryClick(key)}
        centered
        className="menu-tabs"
      >
        {categories.map((category) => (
          <TabPane tab={category.name} key={category.name} />
        ))}
      </Tabs>

      <Content className="menu-container">
        <Row gutter={[16, 16]}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <Col xs={12} sm={8} md={6} key={item.foodId}>
                <Card className="food-card" hoverable>
                  <img
                    src={item.imageUrl}
                    alt={item.foodName}
                    className="food-image"
                  />
                  <div className="food-info">
                    <Text strong className="food-name">
                      {item.foodName}
                    </Text>
                    <div>
                      <Text className="food-description">
                        Giá: {item.price.toLocaleString()}đ
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
