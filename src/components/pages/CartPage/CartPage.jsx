import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  InputNumber,
  Empty,
  message,
  Spin,
  Divider,
  Modal,
  Result,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import "./CartPage.css";

const { Content, Header } = Layout;
const { Title, Text } = Typography;

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const tableQr = "qrtable_22813b59-263a-4275-b7a3-b8853f868da2.png";

  useEffect(() => {
    fetchCartItems();
  }, []);
  
  // Lấy danh sách giỏ hàng từ API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(`cart/${tableQr}`);
      if (response.status === 200) {
        setCartItems(response.data.data || []);
      } else {
        message.error("Không thể lấy thông tin giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      message.error("Đã xảy ra lỗi khi tải giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng món ăn
  const updateQuantity = async (menuItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // Hiển thị xác nhận xóa nếu số lượng <= 0
        Modal.confirm({
          title: "Xác nhận xóa",
          content: "Bạn có muốn xóa món ăn này khỏi giỏ hàng?",
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => removeCartItem(menuItemId),
        });
        return;
      }

      // Chuẩn bị dữ liệu để cập nhật với cấu trúc mới
      const updateData = {
        menuItemId: menuItemId,
        quantity: newQuantity,
      };

      // Gọi API cập nhật với endpoint mới
      const response = await api.put(`cart/${tableQr}/update-item`, updateData);

      if (response.status === 200) {
        // Cập nhật state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        console.log(cartItems);
        message.success("Đã cập nhật số lượng");
      } else {
        message.error("Không thể cập nhật số lượng!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      message.error("Không thể cập nhật số lượng!");
      // Khôi phục lại số lượng ban đầu
      fetchCartItems();
    }
  };

  // Xác nhận trước khi xóa món ăn
  const confirmRemoveItem = (menuItemId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa món ăn này khỏi giỏ hàng?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => removeCartItem(menuItemId),
    });
  };

  // Xóa món ăn khỏi giỏ hàng
  const removeCartItem = async (menuItemId) => {
    try {
      // Điều chỉnh endpoint để phù hợp với API của bạn
      const response = await api.delete(`cart/${tableQr}/remove/${menuItemId}`);

      if (response.status === 200) {
        // Cập nhật state
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.menuItemId !== menuItemId)
        );
        message.success("Đã xóa món khỏi giỏ hàng");
      } else {
        message.error("Không thể xóa món khỏi giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa món:", error);
      message.error("Không thể xóa món khỏi giỏ hàng!");
    }
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Xác nhận đặt món
  const confirmOrder = () => {
    Modal.confirm({
      title: "Xác nhận đặt món",
      content: "Bạn có chắc chắn muốn đặt những món ăn này?",
      onOk: handlePlaceOrder,
      okText: "Đặt món",
      cancelText: "Hủy",
    });
  };

  // Xử lý đặt món
  const handlePlaceOrder = async () => {
    try {
      const response = await api.post(`/cart/${tableQr}/checkout`);

      if (response.status === 200) {
        setOrderPlaced(true);
        setCartItems([]);
        message.success("Đặt món thành công!");
      } else {
        message.error("Không thể đặt món!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt món:", error);
      message.error("Đã xảy ra lỗi khi đặt món!");
    }
  };

  // Quay lại trang menu
  const goToMenu = () => {
    navigate("/");
  };

  // Nếu đơn hàng đã được đặt
  if (orderPlaced) {
    return (
      <Layout className="cart-page">
        <Content>
          <Result
            status="success"
            icon={<CheckCircleOutlined />}
            title="Đặt món thành công!"
            subTitle="Nhà hàng sẽ chuẩn bị món ăn cho bạn trong thời gian sớm nhất."
            extra={[
              <Button type="primary" key="menu" onClick={goToMenu}>
                Tiếp tục gọi món
              </Button>,
            ]}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="cart-page">
      <Header className="cart-header">
        <Button type="text" onClick={goToMenu} className="back-button">
          <ShoppingOutlined /> Tiếp tục gọi món
        </Button>
        <Title level={3} style={{ margin: 0, color: "#fff" }}>
          Giỏ hàng của bạn
        </Title>
      </Header>

      <Content className="cart-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : cartItems.length === 0 ? (
          <Empty
            description="Giỏ hàng của bạn đang trống"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={goToMenu}>
              Đặt món ngay
            </Button>
          </Empty>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card className="cart-items-card">
                  <Title level={4}>Danh sách món ăn</Title>
                  {cartItems.map((item) => (
                    <div key={item.menuItemId} className="cart-item">
                      <div className="item-info">
                        <Text strong>{item.name}</Text>
                        <Text type="secondary">
                          {item.price.toLocaleString()}đ
                        </Text>
                      </div>
                      <div className="item-actions">
                        <Space>
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() =>
                              updateQuantity(item.menuItemId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          />
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) =>
                              updateQuantity(item.menuItemId, value)
                            }
                          />
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() =>
                              updateQuantity(item.menuItemId, item.quantity + 1)
                            }
                          />
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => confirmRemoveItem(item.menuItemId)}
                          />
                        </Space>
                      </div>
                      <div className="item-subtotal">
                        <Text>
                          {(item.price * item.quantity).toLocaleString()}đ
                        </Text>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="summary-card">
                  <Title level={4}>Tổng cộng</Title>
                  <div className="summary-item">
                    <Text>Tạm tính</Text>
                    <Text strong>{calculateTotal().toLocaleString()}đ</Text>
                  </div>
                  <Divider />
                  <div className="summary-total">
                    <Text strong>Tổng cộng</Text>
                    <Text strong style={{ fontSize: "18px", color: "#ff4d4f" }}>
                      {calculateTotal().toLocaleString()}đ
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="checkout-button"
                    onClick={confirmOrder}
                  >
                    Đặt món
                  </Button>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default CartPage;
