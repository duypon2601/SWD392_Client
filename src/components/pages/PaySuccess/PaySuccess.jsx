import React, { useEffect, useState } from "react";
import { Result, Button, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../config/axios";

function PaySuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  const handleBackToTables = () => {
    navigate("/TableManagement");
  };

  const callPaymentCallback = async (amount, orderId) => {
    try {
      const payload = {
        amount: Number(amount) / 100,
        orderId: Number(orderId),
      };
      const response = await api.post("/payment/callback", payload);
      if (response.status === 200) {
        console.log("Callback API gọi thành công:", response.data);
      } else {
        message.error("Lỗi khi gọi callback API!");
      }
    } catch (error) {
      message.error("Lỗi khi gọi callback API: " + error.message);
      console.error("Callback error:", error);
    }
  };

  useEffect(() => {
    const amount = searchParams.get("vnp_Amount");
    const transactionStatus = searchParams.get("vnp_TransactionStatus");

    // Debug dữ liệu nhận được
    console.log("Search Params:", Object.fromEntries(searchParams));
    console.log("Order ID:", orderId);
    console.log("Amount:", amount);
    console.log("Transaction Status:", transactionStatus);

    if (!orderId) {
      message.error("Không tìm thấy mã đơn hàng!");
      setPaymentStatus("error");
      setIsLoading(false);
      return;
    }

    if (!amount || !transactionStatus) {
      message.error("Thiếu thông tin thanh toán từ VNPay!");
      setPaymentStatus("error");
      setIsLoading(false);
      return;
    }

    const formattedAmount = Number(amount) / 100;
    if (transactionStatus === "00") {
      setPaymentStatus("success");
      message.success(
        `Thanh toán thành công ${formattedAmount.toLocaleString()} VND!`
      );
      callPaymentCallback(amount, orderId);
    } else {
      setPaymentStatus("error");
      message.error("Thanh toán không thành công!");
    }
    setIsLoading(false);
  }, [orderId, searchParams]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Đang xử lý kết quả thanh toán...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status={paymentStatus}
        icon={
          paymentStatus === "success" ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          )
        }
        title={
          paymentStatus === "success"
            ? "Thanh Toán Thành Công!"
            : "Thanh Toán Không Thành Công!"
        }
        subTitle={
          orderId
            ? paymentStatus === "success"
              ? `Đơn hàng ${orderId} đã được thanh toán thành công${
                  searchParams.get("vnp_Amount")
                    ? ` với số tiền ${(
                        Number(searchParams.get("vnp_Amount")) / 100
                      ).toLocaleString()} VND`
                    : ""
                }. Cảm ơn bạn đã sử dụng dịch vụ!`
              : `Đơn hàng ${orderId} thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ!`
            : "Không tìm thấy thông tin đơn hàng."
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
}

export default PaySuccess;
