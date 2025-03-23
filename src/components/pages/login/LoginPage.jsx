import React from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice.js";
import { toast } from "react-toastify";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await api.post("api/login", {
        username: values.username,
        password: values.password,
      });

      const user = res.data?.data;
      console.log("user", user);

      toast.success("Login successfully!");
      localStorage.setItem("token", user.token);
      dispatch(login(user));
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "MANAGER") {
        navigate("/Manager");
      } else if (user.role === "STAFF") {
        navigate("/TableManagement");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Login failed!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ color: "#06A3DA" }}>LOGIN HERE</h2>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<i className="fa fa-envelope" />}
              placeholder="Name"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<i className="fa fa-lock" />}
              placeholder="PASSWORD"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              LOGIN
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to="/" className="signup-link">
              Home
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
