import React, { useEffect } from "react";
import { Result, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const PaySuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Lấy orderId từ URL nếu có

  // Hàm điều hướng về trang danh sách bàn
  const handleBackToTables = () => {
    navigate("/TableManagement"); // Điều chỉnh route theo ứng dụng của bạn
  };

  useEffect(() => {
    // Có thể thêm logic xử lý sau thanh toán ở đây nếu cần
    if (orderId) {
      console.log("Thanh toán thành công cho đơn hàng:", orderId);
    }
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status="success"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="Thanh Toán Thành Công!"
        subTitle={
          orderId
            ? `Đơn hàng ${orderId} đã được thanh toán thành công. Cảm ơn bạn đã sử dụng dịch vụ!`
            : "Thanh toán của bạn đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!"
        }
        extra={[
          <Button
            key="back"
            type="primary"
            size="large"
            onClick={handleBackToTables}
            style={{ minWidth: 150 }}
          >
            Quay về danh sách bàn
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaySuccess;
