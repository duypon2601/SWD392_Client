import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MenuPage from "./components/pages/Menu/MenuPage";
import CartPage from "./components/pages/CartPage/CartPage";
import LoginPage from "./components/pages/login/LoginPage"; // Thêm import
import StudentManagement from "./components/StudentManagement"; // Thêm import

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MenuPage />,
    },
    {
      path: "/cart", // Không cần "/MenuPage/CartPage"
      element: <CartPage />,
    },
    {
      path: "/login", // Thêm một trang đăng nhập nữa
      element: <LoginPage />,
    },
    {
      path: "/student", // Thêm trang quản lý sinh viên
      element: <StudentManagement />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/MenuPage" element={<MenuPage />} /> {/* Trang Thực Đơn */}
//         <Route path="/cart" element={<CartPage />} /> {/* Trang Giỏ Hàng */}
//       </Routes>
//     </Router>
//   );
// }

export default App;
