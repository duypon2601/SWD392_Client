import React, { useEffect } from "react";
import { Result, Button, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../config/axios";

function PaySuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();

  // Hàm điều hướng về trang danh sách bàn
  const handleBackToTables = () => {
    navigate("/TableManagement");
  };

  // Hàm gọi API callback khi thanh toán thành công
  const callPaymentCallback = async (amount, orderId) => {
    try {
      const payload = {
        amount: Number(amount) / 100, // Chia cho 100 để ra VND
        orderId: Number(orderId), // Đảm bảo orderId là số
      };
      const response = await api.post("/payment/callback", payload);
      if (response.status === 200) {
        console.log("Callback API gọi thành công:", response.data);
      } else {
        message.error("Lỗi khi gọi callback API!");
      }
    } catch (error) {
      message.error("Lỗi khi gọi callback API: " + error.message);
    }
  };

  useEffect(() => {
    const amount = searchParams.get("vnp_Amount");
    const transactionStatus = searchParams.get("vnp_TransactionStatus");

    if (orderId) {
      console.log("Order ID:", orderId);
      if (amount) {
        const formattedAmount = Number(amount) / 100;
        console.log(
          "Số tiền thanh toán:",
          formattedAmount.toLocaleString(),
          "VND"
        );

        if (transactionStatus === "00") {
          // Thanh toán thành công
          console.log("Thanh toán thành công!");
          message.success("Thanh toán thành công!");
          callPaymentCallback(amount, orderId);
        } else {
          // Thanh toán không thành công
          console.log(
            "Thanh toán không thành công, trạng thái:",
            transactionStatus
          );
          message.error("Thanh toán không thành công!");
        }
      } else {
        console.log("Không tìm thấy số tiền trong query params");
        message.error("Không tìm thấy thông tin thanh toán!");
      }
    }
  }, [orderId, searchParams]);

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
        status={
          searchParams.get("vnp_TransactionStatus") === "00"
            ? "success"
            : "error"
        }
        icon={
          searchParams.get("vnp_TransactionStatus") === "00" ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          )
        }
        title={
          searchParams.get("vnp_TransactionStatus") === "00"
            ? "Thanh Toán Thành Công!"
            : "Thanh Toán Không Thành Công!"
        }
        subTitle={
          orderId
            ? searchParams.get("vnp_TransactionStatus") === "00"
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
