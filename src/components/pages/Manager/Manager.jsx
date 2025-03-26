import { useEffect, useState } from "react";
import {
  ProfileOutlined,
  PlusOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreAddOutlined,
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
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

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

const Manager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [items, setItems] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const role = "manager";
  const user = useSelector(selectUser);

  useEffect(() => {
    if (role === "manager") {
      setItems([
        getItem("CreateRestaurant", "CreateRestaurant", <AppstoreOutlined />),
        getItem("CreateAccount", "CreateAccount", <AppstoreAddOutlined />),
        getItem("CreateMenu", "CreateMenu", <AppstoreOutlined />),
        getItem("MenuResId", "MenuResId", <AppstoreOutlined />),
        getItem("CreateTable", "CreateTable", <AppstoreOutlined />),
      ]);
    }
  }, [role]);

  useEffect(() => {
    const currentURI = location.pathname.split("/").pop();
    // Nếu đường dẫn là "/manager", chuyển hướng đến "/manager/AddMenu"
    if (currentURI === "manager" || location.pathname === "/manager") {
      navigate("/manager/AddMenu");
    } else {
      setOpenKeys((prevKeys) => [...prevKeys, currentURI]);
    }
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
              <Link to={`/manager/${item.key}`}>{item.label}</Link>
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
            {user.restaurant_name} DASHBOARD
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
          {role.toUpperCase()} FANPAGE ©{new Date().getFullYear()} Moon_HotPot
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Manager;
