import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MenuPage from "./components/pages/Menu/MenuPage";
import CartPage from "./components/pages/CartPage/CartPage";
import LoginPage from "./components/pages/login/LoginPage"; // Thêm import
// import StudentManagement from "./components/StudentManagement"; // Thêm import
// import FoodList from "./components/pages/FoodList/FoodList";
import CustomerList from "./components/pages/CustomerList/CustomerList";
import ListNhaHang from "./components/pages/ListNhaHang/ListNhaHang";
import DashBoard from "./components/pages/dashboard/dashboard";
import Category from "./components/pages/Category/category";
import ListFood from "./components/pages/ListFood/ListFood";
import Categori from "./components/pages/Categori/Categori";
import CafeManagement from "./components/pages/CafeManagement/CafeManagement";
import { List } from "antd";
import Test from "./components/pages/Test/Test";
import CreateAccount from "./components/pages/CreateAccount/CreateAccount";
import CreateRestaurant from "./components/pages/CreateRestaurant/CreateRestaurant";

import Manager from "./components/pages/Manager/Manager";
// import CreateMenu from "./components/pages/CreateMenu/CreateMenu";

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
    // {
    //   path: "/student", // Thêm trang quản lý sinh viên
    //   element: <StudentManagement />,
    // },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "CafeManagement",
      element: <CafeManagement />,
    },
    {
      path: "/CreateRestaurant",
      element: <CreateRestaurant />,
    },

    {
      path: "/dashboard",
      element: <DashBoard />,
      children: [
        // {
        //   path: "/dashboard/FoodList",
        //   element: <FoodList />,
        // },
        {
          path: "/dashboard/listnhahang",
          element: <ListNhaHang />,
        },
        {
          path: "/dashboard/CustomerList",
          element: <CustomerList />,
        },
        {
          path: "/dashboard/Category",
          element: <Category />,
        },
        {
          path: "/dashboard/ListFood",
          element: <ListFood />,
        },
        {
          path: "/dashboard/Categori",
          element: <Categori />,
        },
      ],
    },

    {
      path: "/Manager",
      element: <Manager />,
      children: [
        {
          path: "/Manager/CreateAccount",
          element: <CreateAccount />,
        },
      ],
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
