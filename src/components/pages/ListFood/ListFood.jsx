import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Layout,
  message,
  Select,
  Popconfirm,
  Upload,
  Image,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import uploadFile from "../../../utils/file";

const { Content } = Layout;

function ListFood() {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get("/food");
      if (response.data.statusCode === 200) {
        setDataSource(response.data.data);
      } else {
        message.error(
          response.data.message || "Không thể lấy danh sách món ăn"
        );
      }
    } catch (error) {
      message.error("Không thể lấy danh sách món ăn");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      if (res.data.statusCode === 200) {
        setCategories(res.data.data);
      } else {
        message.error("Không thể lấy danh mục");
      }
    } catch (error) {
      message.error("Không thể lấy danh mục");
    }
  };

  // 🛠 Thêm món mới
  const handleSubmit = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      console.log(file);
      // uploadFile(file.originFileObj);
      const url = await uploadFile(file.originFileObj);
      values.image_url = url;
    }
    setLoading(true);
    try {
      const newFood = {
        food_id: 0,
        name: values.name,
        description: values.description,
        image_url: values.image_url || null,
        category_id: values.category_id,
        status: "AVAILABLE",
      };

      const response = await api.post("/food", newFood);

      if (response.data.statusCode === 200) {
        setDataSource([...dataSource, response.data.data]);
        setVisible(false);
        form.resetFields();
        message.success("Thêm món ăn thành công!");
        console.log("dư liệu", response.data.data);
      } else {
        message.error(response.data.message || "Không thể thêm món ăn");
      }
    } catch (error) {
      message.error("Không thể thêm món ăn");
    }
    setLoading(false);
  };

  // lấy ảnh
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // 🛠 Xóa món ăn
  const handleDelete = async (food_id) => {
    try {
      await api.delete(`/food/${food_id}`);
      setDataSource(dataSource.filter((item) => item.food_id !== food_id));
      message.success("Xóa món ăn thành công!");
      alert("Xóa món ăn thành công!");
    } catch (error) {
      message.error("Không thể xóa món ăn");
    }
  };

  // 🛠 Hiển thị modal sửa món ăn
  const showEditModal = (food) => {
    setEditingFood(food);
    form.setFieldsValue(food);
    setEditVisible(true);
  };

  // 🛠 Cập nhật món ăn
  const handleUpdateFood = async (values) => {
    try {
      const updatedFood = {
        ...editingFood,
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        category_id: values.category_id,
      };

      const response = await api.put(
        `/food/${editingFood.food_id}`,
        updatedFood
      );

      if (response.data.statusCode === 200) {
        setDataSource(
          dataSource.map((food) =>
            food.food_id === editingFood.food_id ? response.data.data : food
          )
        );
        setEditVisible(false);
        message.success("Cập nhật món ăn thành công!");
        alert("Cập nhật món ăn thành công!");
      } else {
        message.error(response.data.message || "Không thể cập nhật món ăn");
      }
    } catch (error) {
      message.error("Không thể cập nhật món ăn");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
        <h1>Các món ăn của quán</h1>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          style={{ marginBottom: 10 }}
          icon={<PlusOutlined />}
        >
          Thêm món
        </Button>
        <Table
          dataSource={dataSource}
          columns={[
            { title: "Tên món", dataIndex: "name", key: "name" },
            { title: "Mô tả", dataIndex: "description", key: "description" },
            {
              title: "Hình ảnh",
              dataIndex: "image_url",
              key: "image_url",
              // render: (image_url) =>
              //   image_url ? (
              //     <img
              //       src={image_url}
              //       alt="Hình món ăn"
              //       style={{ width: 50 }}
              //     />
              //   ) : (
              //     "Không có ảnh"
              //   ),
              render: (image_url) => {
                return <img src={image_url} alt="" width={200} />;
              },
            },
            { title: "Danh mục", dataIndex: "category_id", key: "category_id" },
            { title: "Trạng thái", dataIndex: "status", key: "status" },
            {
              title: "Hành động",
              key: "action",
              render: (_, record) => (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => showEditModal(record)}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa món ăn"
                    description="Bạn có chắc chắn muốn xóa món ăn này không?"
                    onConfirm={() => handleDelete(record.food_id)}
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          rowKey="food_id"
        />

        {/* Modal thêm món ăn */}
        <Modal
          title="Thêm món ăn"
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={() => form.submit()}
          block
          confirmLoading={loading}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên món ăn"
              rules={[
                { required: true, message: "Vui lòng nhập tên món ăn" },
                { min: 2, message: "Tên món ăn phải có ít nhất 2 ký tự!" },
                {
                  max: 50,
                  message: "Tên món ăn không được vượt quá 50 ký tự!",
                },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: "Tên món ăn chỉ được chứa chữ cái và khoảng trắng!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả" },
                { min: 5, message: "Mô tả phải có ít nhất 5 ký tự!" },
                { max: 200, message: "Mô tả không được vượt quá 200 ký tự!" },
                {
                  pattern: /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
                  message:
                    "Mô tả chỉ được chứa chữ cái, số, khoảng trắng, dấu phẩy, dấu chấm và dấu gạch ngang!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="image" name="image">
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </Form.Item>

            {/* slect cứng đổ datadata */}
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((category) => (
                  <Select.Option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}

        {/* Modal chỉnh sửa món ăn */}
        <Modal
          title="Chỉnh sửa món ăn"
          open={editVisible}
          onCancel={() => setEditVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleUpdateFood}>
            <Form.Item
              name="name"
              label="Tên món ăn"
              rules={[
                { required: true, message: "Vui lòng nhập tên món ăn" },
                { min: 2, message: "Tên món ăn phải có ít nhất 2 ký tự!" },
                {
                  max: 50,
                  message: "Tên món ăn không được vượt quá 50 ký tự!",
                },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: "Tên món ăn chỉ được chứa chữ cái và khoảng trắng!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả" },
                { min: 5, message: "Mô tả phải có ít nhất 5 ký tự!" },
                { max: 200, message: "Mô tả không được vượt quá 200 ký tự!" },
                {
                  pattern: /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
                  message:
                    "Mô tả chỉ được chứa chữ cái, số, khoảng trắng, dấu phẩy, dấu chấm và dấu gạch ngang!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="image_url" label="Hình ảnh">
              <Input />
            </Form.Item>
            <Form.Item name="category_id" label="Danh mục">
              <Select>
                {categories.map((c) => (
                  <Select.Option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default ListFood;
