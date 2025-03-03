import React, { useEffect, useState } from "react";
import {
  Input,
  Card,
  Button,
  Row,
  Col,
  Badge,
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

const { Search } = Input;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

function MenuPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [searchVisible, setSearchVisible] = useState(false);
  const [categories, setCategories] = useState([]);

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
  console.log("categories", categories);
  useEffect(() => {
    fetchMenuData();
    fetchCategories();
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

  // Hiển thị giỏ hàng
  const showCart = () => {
    if (cart.length === 0) {
      message.info("Giỏ hàng của bạn đang trống");
      return;
    }

    // Tính tổng tiền
    const totalAmount = cart.reduce(
      (total, item) => total + (item.price || 0),
      0
    );

    Modal.info({
      title: "Giỏ hàng của bạn",
      width: 350,
      content: (
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {cart.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <Space>
                <img
                  src={item.image_url || "./img/lauchay.png"}
                  alt={item.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div>{item.price?.toLocaleString() || 0} đ</div>
                </div>
              </Space>
              <Divider style={{ margin: "8px 0" }} />
            </div>
          ))}
          <div
            style={{
              fontWeight: "bold",
              textAlign: "right",
              marginTop: "10px",
            }}
          >
            Tổng cộng: {totalAmount.toLocaleString()} đ
          </div>
        </div>
      ),
      okText: "Thanh toán",
      onOk: () => {
        window.location.href = "/cart";
      },
      cancelText: "Đóng",
      okCancel: true,
    });
  };

  // Toggle thanh tìm kiếm
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        maxWidth: "4804800px", // Kích thước iPhone 14
        margin: "0 auto",
        background: "#f5f5f5",
      }}
    >
      {/* Menu Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{
          background: "#333",
          margin: 0,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
        tabBarStyle={{
          color: "white",
          margin: "auto",
          justifyContent: "space-around",
        }}
      >
        {categories.map((category) => (
          <TabPane
            tab={
              <div
                style={{
                  color:
                    activeTab === String(category.category_id)
                      ? "white"
                      : "rgba(255,255,255,0.7)",
                  padding: "16px 00",
                  backgroundColor:
                    activeTab === String(category.category_id)
                      ? "#c2001b"
                      : "transparent",
                }}
              >
                {category.name}
              </div>
            }
            key={String(category.category_id)}
          />
        ))}
      </Tabs>

      <Content style={{ padding: "16px", background: "#f5f5f5" }}>
        {/* Thanh tìm kiếm (hiển thị khi searchVisible = true) */}
        {searchVisible && (
          <Search
            placeholder="Tìm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "16px",
              borderRadius: "20px",
            }}
            allowClear
          />
        )}

        {/* Danh sách món ăn */}
        <Row gutter={[16, 16]}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <Col xs={12} sm={12} key={item.food_id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  bodyStyle={{
                    padding: "16px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "12px",
                      height: "120px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.image_url || "./img/lauchay.png"}
                      alt={item.name}
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#c2001b",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    {item.name}
                  </Text>

                  <Paragraph
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "8px",
                      flexGrow: 1,
                    }}
                    ellipsis={{ rows: 2 }}
                  >
                    {item.description}
                  </Paragraph>

                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fa541c",
                      marginBottom: "12px",
                    }}
                  >
                    {item.price?.toLocaleString() || 0} đ
                  </Text>

                  <Button
                    style={{
                      borderColor: "#c2001b",
                      color: "#c2001b",
                      borderRadius: "20px",
                      background: "white",
                    }}
                    onClick={() => addToCart(item)}
                  >
                    KHÁM PHÁ
                  </Button>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                Không tìm thấy món ăn nào!
              </div>
            </Col>
          )}
        </Row>
      </Content>

      {/* Nút tìm kiếm nổi */}
      <FloatButton
        icon={<SearchOutlined />}
        onClick={toggleSearch}
        style={{
          right: 24,
          bottom: 90,
          backgroundColor: "#ffbc0d",
          borderColor: "#ffbc0d",
        }}
      />

      {/* Nút giỏ hàng nổi */}
      <FloatButton
        icon={<ShoppingCartOutlined />}
        badge={{ count: cart.length, color: "#c2001b" }}
        onClick={showCart}
        style={{
          right: 24,
          bottom: 24,
          backgroundColor: "#c2001b",
          borderColor: "#c2001b",
          color: "white",
        }}
      />
    </Layout>
  );
}

export default MenuPage;
