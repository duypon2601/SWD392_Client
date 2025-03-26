import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Table,
  Typography,
  Row,
  Col,
  Card,
  message,
  Badge,
  Spin,
  Empty,
  Divider,
  Popconfirm,
} from "antd";
import {
  ShoppingCartOutlined,
  CoffeeOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "./CafeManagement.css";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const TableManagement = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [orderLoading, setOrderLoading] = useState(false);
  const [subOrders, setSubOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [subOrderLoading, setSubOrderLoading] = useState(false);
  const [pendingItemsByTable, setPendingItemsByTable] = useState({});
  const [totalAmountFromApi, setTotalAmountFromApi] = useState(0); // Thêm state để lưu totalAmount từ menuItems

  const handleLogout = () => {
    setOrderLoading(true);
    localStorage.removeItem("token");
    navigate("/login");
    message.success("Logged out successfully");
    setOrderLoading(false);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Trống";
      case "OCCUPIED":
        return "Đang dùng";
      case "RESERVED":
        return "Đã đặt";
      default:
        return "Không xác định";
    }
  };

  const getPendingItemsCount = (subOrders) => {
    let count = 0;
    subOrders.forEach((subOrder) => {
      if (subOrder.status === "PENDING") {
        count += subOrder.subOrderItems.length;
      }
    });
    return count;
  };

  const fetchTableList = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/dining_table/restaurant/${user.restaurantId}`
      );
      if (res.status === 200 && res.data.data) {
        const formattedTables = res.data.data.map((table) => ({
          id: table.id,
          name: `Bàn ${table.id}`,
          status: getStatusText(table.status),
          rawStatus: table.status,
        }));
        setTableList(formattedTables);
        formattedTables.forEach((table) => fetchSubOrders(table.id, false));
        if (formattedTables.length > 0 && !selectedTable) {
          setSelectedTable(formattedTables[0]);
          fetchSubOrders(formattedTables[0].id, true);
          fetchMenuItems(formattedTables[0].id);
        }
      } else {
        message.error("Không thể tải danh sách bàn!");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (diningTableId) => {
    try {
      const res = await api.get(`/order/dining-table/${diningTableId}`);
      console.log("fetchMenuItems response:", res.data); // Log để kiểm tra dữ liệu
      if (res.status === 200 && res.data.data && res.data.data.orderItems) {
        setMenuItems(res.data.data.orderItems);
        // Tính totalAmount từ orderItems.price
        const total = res.data.data.orderItems.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );
        setTotalAmountFromApi(total);
      } else {
        setMenuItems([]);
        setTotalAmountFromApi(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách món ăn:", error);
      setMenuItems([]);
      setTotalAmountFromApi(0);
    }
  };

  const fetchSubOrders = async (diningTableId, setForSelected = false) => {
    try {
      const res = await api.get(`/order/dining-table/${diningTableId}`);
      if (res.status === 200 && res.data.data) {
        const orderId = res.data.data.id;
        const subOrderRes = await api.get(`/sub_order/order/${orderId}`);
        if (subOrderRes.status === 200 && subOrderRes.data.data) {
          const subOrdersData = subOrderRes.data.data;
          if (setForSelected) {
            setSubOrders(subOrdersData);
            setSubOrderLoading(false);
          }
          const pendingCount = getPendingItemsCount(subOrdersData);
          setPendingItemsByTable((prev) => ({
            ...prev,
            [diningTableId]: pendingCount,
          }));
        } else if (
          res.data.data.orderItems &&
          res.data.data.orderItems.length > 0
        ) {
          const orderItemsAsSubOrders = [
            {
              id: orderId,
              orderId: orderId,
              status: res.data.data.status,
              totalPrice: res.data.data.totalPrice,
              subOrderItems: res.data.data.orderItems,
            },
          ];
          if (setForSelected) {
            setSubOrders(orderItemsAsSubOrders);
            setSubOrderLoading(false);
          }
          const pendingCount = getPendingItemsCount(orderItemsAsSubOrders);
          setPendingItemsByTable((prev) => ({
            ...prev,
            [diningTableId]: pendingCount,
          }));
        } else {
          if (setForSelected) {
            setSubOrders([]);
            setSubOrderLoading(false);
          }
          setPendingItemsByTable((prev) => ({ ...prev, [diningTableId]: 0 }));
        }
      } else {
        if (setForSelected) {
          setSubOrders([]);
          setSubOrderLoading(false);
        }
        setPendingItemsByTable((prev) => ({ ...prev, [diningTableId]: 0 }));
      }
    } catch (error) {
      if (setForSelected) {
        setSubOrders([]);
        setSubOrderLoading(false);
      }
      setPendingItemsByTable((prev) => ({ ...prev, [diningTableId]: 0 }));
      console.error("Lỗi khi tải subOrders:", error);
    }
  };

  const completeSubOrder = async (subOrderId) => {
    try {
      const res = await api.put(`/sub_order/${subOrderId}/complete`);
      if (res.status === 200) {
        message.success("Xác nhận đơn hàng thành công!");
        fetchSubOrders(selectedTable.id, true);
        fetchMenuItems(selectedTable.id);
      } else {
        message.error("Không thể xác nhận đơn hàng!");
      }
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng: " + error.message);
    }
  };

  const handlePayment = async () => {
    if (!selectedTable) {
      message.error("Vui lòng chọn bàn trước khi thanh toán!");
      return;
    }
    try {
      setOrderLoading(true);
      const orderRes = await api.get(`/order/dining-table/${selectedTable.id}`);
      if (!orderRes.data.data || !orderRes.data.data.id) {
        message.error("Không tìm thấy đơn hàng cho bàn này!");
        return;
      }
      const orderId = orderRes.data.data.id;
      const completeRes = await api.put(`/order/${orderId}/complete`);
      if (completeRes.status === 200) {
        message.success("Thanh toán thành công!");
        await fetchTableList();
        if (selectedTable) {
          await fetchSubOrders(selectedTable.id, true);
          await fetchMenuItems(selectedTable.id);
        }
      } else {
        message.error("Thanh toán thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi thanh toán: " + error.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleVNPay = async () => {
    if (!selectedTable) {
      message.error("Vui lòng chọn bàn trước khi thanh toán!");
      return;
    }
    try {
      setOrderLoading(true);
      const orderRes = await api.get(`/order/dining-table/${selectedTable.id}`);
      if (!orderRes.data.data || !orderRes.data.data.id) {
        message.error("Không tìm thấy đơn hàng cho bàn này!");
        return;
      }
      const orderId = orderRes.data.data.id;
      const paymentData = {
        amount: totalAmountFromApi, // Dùng totalAmount từ menuItems
        orderId: orderId,
      };
      const createRes = await api.post("/payment/create", paymentData);
      if (createRes.status === 200 && createRes.data) {
        let paymentUrl = createRes.data;
        if (typeof createRes.data === "object" && createRes.data.url) {
          paymentUrl = createRes.data.url;
        }
        if (typeof paymentUrl === "string" && paymentUrl.startsWith("http")) {
          window.open(paymentUrl);
          message.success("Đang chuyển hướng đến VNPay...");
        } else {
          message.error("URL thanh toán không hợp lệ!");
        }
      } else {
        message.error("Tạo link thanh toán VNPay thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý VNPay:", error);
      message.error("Lỗi thanh toán VNPay: " + error.message);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchTableList();
    const interval = setInterval(() => {
      fetchTableList();
      if (selectedTable) {
        fetchSubOrders(selectedTable.id, true);
        fetchMenuItems(selectedTable.id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedTable]);

  const processSubOrderItems = () => {
    const allItems = [];
    subOrders.forEach((subOrder) => {
      subOrder.subOrderItems.forEach((item) => {
        allItems.push({
          key: item.id,
          name: item.menuItemName || `Menu Item ID: ${item.menuItemId}`,
          quantity: item.quantity,
          price: item.price / item.quantity,
          total: item.price,
          status: subOrder.status,
          subOrderId: subOrder.id,
        });
      });
    });
    return allItems;
  };

  const orderList = processSubOrderItems();

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 70,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 120,
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      width: 120,
      render: (total) => <Text strong>{total.toLocaleString()}đ</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status) => {
        let color =
          status === "PENDING"
            ? "warning"
            : status === "COMPLETED"
            ? "success"
            : status === "CANCELLED"
            ? "error"
            : status === "CONFIRMED"
            ? "processing"
            : "default";
        return <Badge status={color} text={status} />;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) =>
        record.status === "PENDING" ? (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => completeSubOrder(record.subOrderId)}
          >
            Xác nhận
          </Button>
        ) : null,
    },
  ];

  const totalAmount = totalAmountFromApi; // Dùng totalAmount từ menuItems

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    message.info(`Đã chọn ${table.name}`);
    fetchSubOrders(table.id, true);
    fetchMenuItems(table.id);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge status="success" text="Trống" />;
      case "OCCUPIED":
        return <Badge status="error" text="Đang dùng" />;
      case "RESERVED":
        return <Badge status="warning" text="Đã đặt" />;
      default:
        return <Badge status="default" text="Không xác định" />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        theme="light"
        className="cafe-sider"
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          overflow: "auto",
          position: "relative",
        }}
      >
        <div
          className="logo-container"
          style={{
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
            textAlign: "center",
            background: "#1890ff",
            color: "white",
          }}
        >
          <Title
            level={4}
            style={{ margin: 0, color: "white", display: "inline" }}
          >
            Moon HotPot
          </Title>
        </div>
        <div style={{ padding: "16px 8px" }}>
          <Title level={5} style={{ marginBottom: 16, textAlign: "center" }}>
            Danh Sách Bàn
          </Title>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin tip="Đang tải..." />
            </div>
          ) : tableList.length === 0 ? (
            <Empty description="Không có bàn nào" />
          ) : (
            <div
              className="table-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              {tableList.map((table) => (
                <Card
                  key={table.id}
                  className={`table-card ${
                    selectedTable?.id === table.id ? "selected-table" : ""
                  }`}
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    margin: 0,
                    borderColor:
                      selectedTable?.id === table.id ? "#1890ff" : "#d9d9d9",
                    borderWidth: selectedTable?.id === table.id ? "2px" : "1px",
                    background:
                      table.rawStatus === "AVAILABLE"
                        ? "#f6ffed"
                        : table.rawStatus === "OCCUPIED"
                        ? "#fff1f0"
                        : "#fffbe6",
                    position: "relative",
                  }}
                  hoverable
                  onClick={() => handleTableSelect(table)}
                >
                  <div style={{ fontWeight: "bold" }}>{table.name}</div>
                  <div style={{ marginTop: 5 }}>
                    {renderStatusBadge(table.rawStatus)}
                  </div>
                  {pendingItemsByTable[table.id] > 0 && (
                    <Badge
                      count={pendingItemsByTable[table.id]}
                      style={{
                        backgroundColor: "#f5222d",
                        position: "absolute",
                        top: 5,
                        right: 5,
                        fontSize: 10,
                      }}
                    />
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "white",
            padding: "0 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            height: "64px",
            lineHeight: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {selectedTable && (
              <Text strong style={{ fontSize: 16 }}>
                {selectedTable.name} -{" "}
                {renderStatusBadge(selectedTable.rawStatus)}
              </Text>
            )}
          </div>
          <Popconfirm
            title="Bạn có chắc muốn đăng xuất?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
            block
          >
            <Button type="primary" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Popconfirm>
        </Header>
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ShoppingCartOutlined style={{ marginRight: 8 }} />
                    Chi tiết đơn hàng
                  </div>
                }
                className="order-details-card"
                bordered={false}
                style={{ borderRadius: 8, height: "100%" }}
                extra={subOrderLoading ? <Spin size="small" /> : null}
              >
                {selectedTable && (
                  <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ marginBottom: 12 }}>
                      Danh sách món ăn
                    </Title>
                    {menuItems.length > 0 ? (
                      <div
                        style={{
                          background: "#fafafa",
                          padding: "12px",
                          borderRadius: "4px",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        {menuItems.map((item, index) => (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                              paddingBottom: 8,
                              borderBottom:
                                index !== menuItems.length - 1
                                  ? "1px dashed #e8e8e8"
                                  : "none",
                            }}
                          >
                            <Text>{item.menuItemName}</Text>
                            <div>
                              <Text style={{ marginRight: 16 }}>
                                x{item.quantity}
                              </Text>
                              <Text strong>{item.price.toLocaleString()}đ</Text>
                            </div>
                          </div>
                        ))}
                        {/* Thêm tổng cộng ngay dưới danh sách */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: 12,
                            borderTop: "1px solid #e8e8e8",
                            marginTop: 8,
                          }}
                        >
                          <Text strong>Tổng cộng:</Text>
                          <Text
                            strong
                            style={{ color: "#f5222d", fontSize: 16 }}
                          >
                            {totalAmount.toLocaleString()}đ
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <Empty
                        description="Chưa có món ăn nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </div>
                )}
                <Divider />
                <Table
                  columns={columns}
                  dataSource={orderList}
                  pagination={false}
                  loading={subOrderLoading}
                  locale={{ emptyText: "Chưa có món ăn nào được chọn" }}
                  rowClassName="order-table-row"
                  style={{ marginBottom: 24 }}
                  // summary={() => (
                  //   <Table.Summary>
                  //     <Table.Summary.Row>
                  //       <Table.Summary.Cell
                  //         colSpan={3}
                  //         style={{ textAlign: "right" }}
                  //       >
                  //         <Text strong>Tổng cộng:</Text>
                  //       </Table.Summary.Cell>
                  //       <Table.Summary.Cell style={{ textAlign: "right" }}>
                  //         <Text
                  //           strong
                  //           style={{ color: "#f5222d", fontSize: 16 }}
                  //         >
                  //           {totalAmount.toLocaleString()}đ
                  //         </Text>
                  //       </Table.Summary.Cell>
                  //       <Table.Summary.Cell></Table.Summary.Cell>
                  //     </Table.Summary.Row>
                  //   </Table.Summary>
                  // )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <DollarOutlined style={{ marginRight: 8 }} />
                    Thanh toán
                  </div>
                }
                bordered={false}
                style={{ borderRadius: 8 }}
                className="payment-card"
              >
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Tạm tính:</Text>
                    <Text>{totalAmount.toLocaleString()}đ</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Giảm giá:</Text>
                    <Text>0đ</Text>
                  </div>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <Text strong>Tổng thanh toán:</Text>
                  <Text strong style={{ color: "#f5222d", fontSize: 18 }}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<DollarOutlined />}
                  disabled={
                    (menuItems.length === 0 && orderList.length === 0) ||
                    !selectedTable
                  }
                  style={{ height: "46px", fontSize: "16px" }}
                  onClick={handlePayment}
                  loading={orderLoading}
                >
                  Thanh Toán
                </Button>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<DollarOutlined />}
                  disabled={
                    (menuItems.length === 0 && orderList.length === 0) ||
                    !selectedTable
                  }
                  style={{
                    height: "46px",
                    fontSize: "16px",
                    marginTop: "10px",
                  }}
                  onClick={handleVNPay}
                  loading={orderLoading}
                >
                  VNPay
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TableManagement;
