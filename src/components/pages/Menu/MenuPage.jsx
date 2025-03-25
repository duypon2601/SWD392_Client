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
  InputNumber,
} from "antd";
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import "./MenuPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/features/cartSlice";
import { selectUser } from "../../redux/features/userSlice";

const { Search } = Input;
const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]); // Danh sách món ăn
  const [categories, setCategories] = useState([]); // Danh mục
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [orderLoading, setOrderLoading] = useState(false); // load món ăn
  const tableQr = "qrtable_22813b59-263a-4275-b7a3-b8853f868da2.png";

  useEffect(() => {
    fetchMenuData();
    fetchCategories();
  }, []);

  //  Lấy danh sách món ăn từ API
  const fetchMenuData = async () => {
    try {
      const res = await api.get(`menu/restaurant/${user.restaurantId}`);
      if (res.status === 200 && res.data.data.length > 0) {
        const menu = res.data.data[0]; // Lấy menu đầu tiên
        setMenuData(menu.menuItems || []);
      } else {
        message.error("Không thể lấy dữ liệu món ăn!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("API Error:", error);
    }
  };

  //  Lấy danh sách danh mục từ API
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

  //  Khi chọn danh mục
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  //  Lọc món ăn theo danh mục (categoryName) và từ khóa tìm kiếm
  const filteredMenu = menuData
    .filter(
      (item) =>
        selectedCategory === null || item.categoryName === selectedCategory
    )
    .filter((item) =>
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  //  Điều hướng sang trang giỏ hàng
  const showCart = () => {
    if (cartcount.length === 0) {
      message.info("Giỏ hàng của bạn đang trống");
      return;
    }
    navigate("/cart");
  };

  // Mở modal khi nhấn vào nút "Thêm vào giỏ"
  const showQuantityModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
    console.log(item);
  };

  // Tăng số lượng
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Đóng modal
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Dispatch để thêm vào giỏ hàng
  const dispatch = useDispatch();

  // Hàm thêm món vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedItem) return;

    try {
      setOrderLoading(true);

      const response = await api.post(`/cart/${tableQr}/add`, null, {
        params: {
          menuItemId: selectedItem.foodId,
          quantity: quantity,
        },
      });

      if (response.status === 200) {
        // Thêm sản phẩm vào Redux với số lượng đã chọn
        const itemWithQuantity = {
          ...selectedItem,
          quantity: quantity,
        };
        dispatch(addProduct(itemWithQuantity));
        message.success(
          `${quantity} ${selectedItem.foodName} đã thêm vào giỏ hàng!`
        );
        setModalVisible(false);
      } else {
        message.error("Không thể thêm món ăn vào giỏ hàng!");
      }
    } catch (error) {
      message.error("Lỗi khi thêm món ăn!");
      console.error("API Error:", error);
    }
    setOrderLoading(false);
  };

  // Đếm sản phẩm trong giỏ hàng
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
                      type="primary"
                      className="add-to-cart-btn"
                      onClick={() => showQuantityModal(item)}
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

      {/* Modal chọn số lượng */}
      <Modal
        title={selectedItem?.foodName}
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          // <Button key="cancel" onClick={handleCancel}>
          //   Hủy
          // </Button>,
          <Button
            key="submit"
            type="primary"
            block
            // className="checkout-button"
            className="add-to-cart-btn"
            loading={orderLoading}
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>,
        ]}
      >
        {selectedItem && (
          <div className="quantity-selector">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <Button
                icon={<MinusOutlined />}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              />
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                style={{ margin: "0 10px", width: "60px", textAlign: "center" }}
              />
              <Button icon={<PlusOutlined />} onClick={increaseQuantity} />
            </div>
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <Text>
                Tổng: {(selectedItem.price * quantity).toLocaleString()}đ
              </Text>
            </div>
          </div>
        )}
      </Modal>

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
