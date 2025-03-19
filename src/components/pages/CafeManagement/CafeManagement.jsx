import React, { useState, useEffect } from "react";
import { Layout, Button, Table, Typography, Row, Col, Card } from "antd";
import "./CafeManagement.css";
import api from "../../config/axios";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const CafeManagement = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Gọi API để lấy danh sách bàn
  const fetchTableList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dining_table");
      if (res.status === 200 && res.data.data) {
        const formattedTables = res.data.data.map((table, index) => ({
          id: table.id,
          name: `Bàn ${index + 1}`, // Hoặc bạn có thể dùng qrCode làm tên
          status: getStatusText(table.status),
          rawStatus: table.status, // Lưu status gốc nếu cần
        }));
        setTableList(formattedTables);
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
    { key: 1, name: "Cơm chiên", quantity: 2, price: 35000, total: 70000 },
    { key: 2, name: "Trà sữa", quantity: 1, price: 25000, total: 25000 },
    { key: 3, name: "Nước cam", quantity: 3, price: 20000, total: 60000 },
  ];

  const columns = [
    { title: "Tên Món", dataIndex: "name", key: "name" },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn Giá", dataIndex: "price", key: "price" },
    { title: "Thành Tiền", dataIndex: "total", key: "total" },
  ];

  return (
    <Layout style={{ height: "100vh", textAlign: "center" }}>
      {/* Sidebar Danh Sách Bàn */}
      <Sider width={200} style={{ background: "#e6f7ff", padding: "10px" }}>
        <Text strong>Danh Sách Bàn</Text>
        <div className="table-list">
          {loading ? (
            <Text>Đang tải...</Text>
          ) : (
            tableList.map((table) => (
              <Card
                key={table.id}
                className="table-card"
                style={{ textAlign: "center" }}
              >
                {table.name} <br />
                <Text
                  type={
                    table.rawStatus === "AVAILABLE"
                      ? "success"
                      : table.rawStatus === "OCCUPIED"
                      ? "danger"
                      : "warning"
                  }
                >
                  {table.status}
                </Text>
              </Card>
            ))
          )}
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#1890ff",
            padding: "10px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Text strong style={{ fontSize: "18px" }}>
            Quản Lý Quán Cafe
          </Text>
        </Header>

        {/* Nội dung chính */}
        <Content style={{ padding: "20px" }}>
          <Row>
            {/* Bảng món đã chọn */}
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={orderList}
                pagination={false}
              />

              {/* Tổng tiền */}
              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <Text strong style={{ fontSize: "16px", color: "red" }}>
                  Tổng Tiền:{" "}
                  {orderList.reduce((sum, item) => sum + item.total, 0)} VNĐ
                </Text>
              </div>

              {/* Nút Thanh Toán */}
              <Button
                type="primary"
                style={{ marginTop: "10px", width: "100%" }}
              >
                Thanh Toán
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CafeManagement;
