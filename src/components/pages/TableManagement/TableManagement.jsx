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

  const handleLogout = () => {
    setOrderLoading(true);
    localStorage.removeItem("token");
    navigate("/login");
    message.success("Logged out successfully");
    setOrderLoading(false);
  };

  // Hàm chuyển đổi status từ API sang tiếng Việt
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

  // Gọi API để lấy danh sách bàn với endpoint mới
  const fetchTableList = async () => {
    setLoading(true);
    try {
      // Sử dụng endpoint mới
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

        // Set bàn đầu tiên là mặc định nếu có
        if (formattedTables.length > 0 && !selectedTable) {
          setSelectedTable(formattedTables[0]);
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

  // Gọi API khi component mount
  useEffect(() => {
    fetchTableList();
  }, []);

  // Danh sách món ăn (Giả định)
  const orderList = [
    {
      key: 1,
      name: "Cơm chiên hải sản",
      quantity: 2,
      price: 35000,
      total: 70000,
    },
    {
      key: 2,
      name: "Trà sữa trân châu",
      quantity: 1,
      price: 25000,
      total: 25000,
    },
    { key: 3, name: "Nước cam tươi", quantity: 3, price: 20000, total: 60000 },
    { key: 4, name: "Bánh flan", quantity: 2, price: 15000, total: 30000 },
  ];

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
  ];

  // Tính tổng tiền
  const totalAmount = orderList.reduce((sum, item) => sum + item.total, 0);

  // Hàm xử lý chọn bàn
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    message.info(`Đã chọn ${table.name}`);
  };

  // Render badge status cho từng trạng thái
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
      {/* Sidebar Danh Sách Bàn */}
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
          {/* <CoffeeOutlined style={{ fontSize: 24, marginRight: 8 }} /> */}
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
                  }}
                  hoverable
                  onClick={() => handleTableSelect(table)}
                >
                  <div style={{ fontWeight: "bold" }}>{table.name}</div>
                  <div style={{ marginTop: 5 }}>
                    {renderStatusBadge(table.rawStatus)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Sider>

      <Layout>
        {/* Header */}
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

        {/* Nội dung chính */}
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
              >
                <Table
                  columns={columns}
                  dataSource={orderList}
                  pagination={false}
                  locale={{ emptyText: "Chưa có món ăn nào được chọn" }}
                  rowClassName="order-table-row"
                  style={{ marginBottom: 24 }}
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row>
                        <Table.Summary.Cell
                          colSpan={3}
                          style={{ textAlign: "right" }}
                        >
                          <Text strong>Tổng cộng:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell style={{ textAlign: "right" }}>
                          <Text
                            strong
                            style={{ color: "#f5222d", fontSize: 16 }}
                          >
                            {totalAmount.toLocaleString()}đ
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
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
                  disabled={orderList.length === 0 || !selectedTable}
                  style={{ height: "46px", fontSize: "16px" }}
                >
                  Thanh Toán
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
