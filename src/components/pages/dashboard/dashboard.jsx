import { useEffect, useState } from "react";
import {
  ProfileOutlined,
  PlusOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  Popconfirm,
  message,
  Breadcrumb,
  theme,
  Typography,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Sider, Footer } = Layout;
const { Title } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [items, setItems] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const role = "admin";

  useEffect(() => {
    if (role === "admin") {
      setItems([
        getItem("ListFood", "listfood", <AppstoreOutlined />),
        getItem("List Nhà Hàng", "listnhahang", <AppstoreOutlined />),
        getItem("Categori", "Categori", <AppstoreOutlined />),
        getItem("Customer List", "CustomerList", <UserOutlined />),
      ]);
    }
  }, [role]);

  useEffect(() => {
    const currentURI = location.pathname.split("/").pop();
    if (currentURI === "dashboard") {
      navigate("/dashboard/ListFood");
    }
    setOpenKeys((prevKeys) => [...prevKeys, currentURI]);
  }, [location.pathname, navigate]);

  useEffect(() => {
    localStorage.setItem("keys", JSON.stringify(openKeys));
  }, [openKeys]);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    message.success("Logged out successfully");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "#001529",
          boxShadow: "2px 0 6px rgba(0, 21, 41, 0.35)",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center", color: "white" }}>
          <Title
            level={collapsed ? 4 : 3}
            style={{ color: "white", margin: 0 }}
          >
            {collapsed ? "MHP" : "Moon HotPot"}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split("/").pop()]}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
          style={{ fontSize: "16px" }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={`/dashboard/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "18px", marginLeft: "10px" }}
          />
          <Title level={3} style={{ margin: 0, color: "#333" }}>
            {role.toLocaleUpperCase()} DASHBOARD
          </Title>
          <Popconfirm
            title="Bạn có chắc muốn đăng xuất?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Popconfirm>
        </Header>

        {/* Content */}
        <Content style={{ padding: "24px", background: "#fff", flex: 1 }}>
          <Breadcrumb style={{ marginBottom: "16px" }}>
            {location.pathname
              .split("/")
              .filter((path) => path)
              .map((path, index) => (
                <Breadcrumb.Item key={index}>
                  <Link to={`/${path}`}>{path}</Link>
                </Breadcrumb.Item>
              ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
              minHeight: "75vh",
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", backgroundColor: "#E3F2EE" }}>
          ADMIN FANPAGE ©{new Date().getFullYear()} Moon_HotPot
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

// import {
//   Form,
//   Input,
//   Modal,
//   Table,
//   Popconfirm,
//   Button,
//   message,
//   Space,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useForm } from "antd/es/form/Form";
// import React, { useEffect, useState } from "react";
// import api from "../../config/axios";

// function CategoryManagement() {
//   const [Categories, setCategories] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [form] = useForm();
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/category");
//       if (res.data.statusCode === 200 && res.data.data) {
//         setCategories(res.data.data);
//         console.log("Categories", res.data.data);
//       } else {
//         message.error(res.data.message || "Không thể lấy danh mục");
//       }
//     } catch (error) {
//       console.error("Lỗi khi lấy danh mục:", error);
//       message.error("Không thể lấy danh mục");
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     try {
//       await api.delete(`/category/${categoryId}`);
//       message.success("Xóa danh mục thành công!");
//       alert("Xóa danh mục thành công!");
//       fetchCategories();
//     } catch (error) {
//       console.error("Lỗi khi xóa danh mục:", error);
//       message.error("Xóa danh mục thất bại");
//     }
//   };

//   const showAddModal = () => {
//     setIsAddingNew(true);
//     setEditingCategory(null);
//     form.resetFields();
//     setOpenModal(true);
//   };

//   const handleAddCategory = async () => {
//     try {
//       const values = await form.validateFields();
//       await api.post("/category", values);
//       message.success("Thêm danh mục thành công!");
//       alert("Thêm danh mục thành công!");
//       setOpenModal(false);
//       fetchCategories();
//     } catch (error) {
//       console.error("Lỗi khi thêm danh mục:", error);
//       message.error("Thêm danh mục thất bại");
//     }
//   };

//   const showEditModal = (category) => {
//     setIsAddingNew(false);
//     setEditingCategory(category);
//     form.setFieldsValue({
//       name: category.name,
//     });
//     setOpenModal(true);
//   };

//   const handleUpdateCategory = async () => {
//     try {
//       const values = await form.validateFields();
//       await api.put(`/category/${editingCategory.category_id}`, values);
//       message.success("Cập nhật danh mục thành công!");
//       alert("Cập nhật danh mục thành công!");
//       setOpenModal(false);
//       fetchCategories();
//     } catch (error) {
//       console.error("Lỗi khi cập nhật danh mục:", error);
//       message.error("Cập nhật danh mục thất bại");
//     }
//   };

//   const handleModalOk = () => {
//     if (isAddingNew) {
//       handleAddCategory();
//     } else {
//       handleUpdateCategory();
//     }
//   };

//   const handleCancel = () => {
//     setOpenModal(false);
//     setEditingCategory(null);
//     setIsAddingNew(false);
//     form.resetFields();
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const columns = [
//     // { title: "ID", dataIndex: "category_id", key: "category_id" },
//     { title: "Name", dataIndex: "name", key: "name" },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <div style={{ display: "flex"}}>
//           <Space>
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             onClick={() => showEditModal(record)}
//             style={{ marginRight: 5 }}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Xóa danh mục"
//             description="Bạn có chắc chắn muốn xóa danh mục này không?"
//             onConfirm={() => handleDeleteCategory(record.category_id)}
//           >
//             <Button type="primary" danger icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div style={{ marginBottom: 16 }}>
//         <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
//           thêm món mới
//         </Button>
//       </div>

//       <Table dataSource={Categories} columns={columns} rowKey="category_id" />

//       <Modal
//         title={isAddingNew ? "Thêm danh mục mới" : "Cập nhật danh mục"}
//         open={openModal}
//         onOk={handleModalOk}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="name"
//             label="Tên danh mục"
//             rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// }

// export default CategoryManagement;

// import {
//   Button,
//   Form,
//   Input,
//   Modal,
//   Table,
//   Layout,
//   message,
//   Select,
//   Popconfirm,
// } from "antd";
// import { useForm } from "antd/es/form/Form";
// import React, { useState, useEffect } from "react";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import api from "../../config/axios";

// const { Content } = Layout;

// function FoodList() {
//   const [form] = useForm();
//   const [visible, setVisible] = useState(false);
//   const [editVisible, setEditVisible] = useState(false);
//   const [dataSource, setDataSource] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [editingFood, setEditingFood] = useState(null);

//   useEffect(() => {
//     fetchFoods();
//     fetchCategories();

//   }, []);

//   const fetchFoods = async () => {
//     try {
//       const response = await api.get("/food");
//       if (response.data.statusCode === 200) {
//         setDataSource(response.data.data);
//         console.log("res", response.data.data);
//       } else {
//         message.error(
//           response.data.message || "Không thể lấy danh sách món ăn"
//         );
//       }
//     } catch (error) {
//       message.error("Không thể lấy danh sách món ăn");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/category");
//       if (res.data.statusCode === 200) {
//         setCategories(res.data.data);
//       } else {
//         message.error("Không thể lấy danh mục");
//       }
//     } catch (error) {
//       message.error("Không thể lấy danh mục");
//     }
//   };

//   // 🛠 Thêm món mới
//   const handleSubmit = async (values) => {
//     try {
//       const newFood = {
//         food_id: 0,
//         name: values.name,
//         description: values.description,
//         image_url: values.image_url || null,
//         category_id: values.category_id,
//         status: "AVAILABLE",
//       };

//       const response = await api.post("/food", newFood);

//       if (response.data.statusCode === 200) {
//         setDataSource([...dataSource, response.data.data]);
//         setVisible(false);
//         form.resetFields();
//         message.success("Thêm món ăn thành công!");
//       } else {
//         message.error(response.data.message || "Không thể thêm món ăn");
//       }
//     } catch (error) {
//       message.error("Không thể thêm món ăn");
//     }
//   };

//   // 🛠 Xóa món ăn
//   const handleDelete = async (food_id) => {
//     try {
//       await api.delete(`/food/${food_id}`);
//       setDataSource(dataSource.filter((item) => item.food_id !== food_id));
//       message.success("Xóa món ăn thành công!");
//       alert("Xóa món ăn thành công!");
//     } catch (error) {
//       message.error("Không thể xóa món ăn");
//     }
//   };

//   // 🛠 Hiển thị modal sửa món ăn
//   const showEditModal = (food) => {
//     setEditingFood(food);
//     form.setFieldsValue(food);
//     setEditVisible(true);
//   };

//   // 🛠 Cập nhật món ăn
//   const handleUpdateFood = async (values) => {
//     try {
//       const updatedFood = {
//         ...editingFood,
//         name: values.name,
//         description: values.description,
//         image_url: values.image_url,
//         category_id: values.category_id,
//       };

//       const response = await api.put(
//         `/food/${editingFood.food_id}`,
//         updatedFood
//       );

//       if (response.data.statusCode === 200) {
//         setDataSource(
//           dataSource.map((food) =>
//             food.food_id === editingFood.food_id ? response.data.data : food
//           )
//         );
//         setEditVisible(false);
//         message.success("Cập nhật món ăn thành công!");
//         alert("Cập nhật món ăn thành công!");
//       } else {
//         message.error(response.data.message || "Không thể cập nhật món ăn");
//       }
//     } catch (error) {
//       message.error("Không thể cập nhật món ăn");
//     }
//   };

//   return (
//     <Layout>
//       <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
//         <h1>Các món ăn của quán</h1>
//         <Button
//           type="primary"
//           onClick={() => setVisible(true)}
//           style={{ marginBottom: 10 }}
//           icon={<PlusOutlined />}
//         >
//           Thêm món
//         </Button>
//         <Table
//           dataSource={dataSource}
//           columns={[
//             { title: "Tên món", dataIndex: "name", key: "name" },
//             { title: "Mô tả", dataIndex: "description", key: "description" },
//             {
//               title: "Hình ảnh",
//               dataIndex: "image_url",
//               key: "image_url",
//               render: (image_url) =>
//                 image_url ? (
//                   <img
//                     src={image_url}
//                     alt="Hình món ăn"
//                     style={{ width: 50 }}
//                   />
//                 ) : (
//                   "Không có ảnh"
//                 ),
//             },
//             { title: "Danh mục", dataIndex: "category_id", key: "category_id" },
//             { title: "Trạng thái", dataIndex: "status", key: "status" },
//             {
//               title: "Hành động",
//               key: "action",
//               render: (_, record) => (
//                 <>
//                   <Button
//                     type="primary"
//                     icon={<EditOutlined />}
//                     style={{ marginRight: 5 }}
//                     onClick={() => showEditModal(record)}
//                   >
//                     Sửa
//                   </Button>
//                   <Popconfirm
//                     title="Xóa món ăn"
//                     description="Bạn có chắc chắn muốn xóa món ăn này không?"
//                     onConfirm={() => handleDelete(record.food_id)}
//                   >
//                     <Button type="primary" danger icon={<DeleteOutlined />}>
//                       Xóa
//                     </Button>
//                   </Popconfirm>
//                 </>
//               ),
//             },
//           ]}
//           rowKey="food_id"
//         />

//         {/* Modal thêm món ăn */}
//         <Modal
//           title="Thêm món ăn"
//           open={visible}
//           onCancel={() => setVisible(false)}
//           onOk={() => form.submit()}
//         >
//           <Form form={form} onFinish={handleSubmit}>
//             <Form.Item
//               name="name"
//               label="Tên món ăn"
//               rules={[{ required: true, message: "Vui lòng nhập tên món ăn" }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="description"
//               label="Mô tả"
//               rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item name="image_url" label="Hình ảnh">
//               <Input placeholder="Nhập URL hình ảnh" />
//             </Form.Item>
//             <Form.Item
//               name="category_id"
//               label="Danh mục"
//               rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
//             >
//               <Select placeholder="Chọn danh mục">
//                 {categories.map((category) => (
//                   <Select.Option
//                     key={category.category_id}
//                     value={category.category_id}
//                   >
//                     {category.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Form>
//         </Modal>

//         {/* Modal chỉnh sửa món ăn */}
//         <Modal
//           title="Chỉnh sửa món ăn"
//           open={editVisible}
//           onCancel={() => setEditVisible(false)}
//           onOk={() => form.submit()}
//         >
//           <Form form={form} onFinish={handleUpdateFood}>
//             <Form.Item name="name" label="Tên món ăn">
//               <Input />
//             </Form.Item>
//             <Form.Item name="description" label="Mô tả">
//               <Input />
//             </Form.Item>
//             <Form.Item name="image_url" label="Hình ảnh">
//               <Input />
//             </Form.Item>
//             <Form.Item name="category_id" label="Danh mục">
//               <Select>
//                 {categories.map((c) => (
//                   <Select.Option key={c.category_id} value={c.category_id}>
//                     {c.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Form>
//         </Modal>
//       </Content>
//     </Layout>
//   );
// }

// export default FoodList;
