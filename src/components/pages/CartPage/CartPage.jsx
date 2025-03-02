import React from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();

  // Hàm điều hướng về MenuPage
  const handleNavigate = () => {
    navigate("/FoodList"); // Điều hướng về trang MenuPage
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "black" }}>Giỏ Hàng</h1>
      <p style={{ color: "black" }}>
        Danh sách các món ăn trong giỏ sẽ hiển thị ở đây (phần này sẽ phát triển
        thêm).
      </p>
      <button style={{ color: "blue" }} onClick={handleNavigate}>
        return
      </button>
    </div>
  );
}

export default CartPage;
