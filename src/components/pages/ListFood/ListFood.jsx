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
  Spin,
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
  const [loading, setLoading] = useState({
    table: true, // Loading cho bảng khi fetch lần đầu
    submit: false, // Loading cho nút OK trong modal
  });

  useEffect(() => {
    fetchData(); // Gọi hàm fetch tổng hợp
  }, []);

  // Hàm tổng hợp để fetch cả món ăn và danh mục
  const fetchData = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      const [foodResponse, categoryResponse] = await Promise.all([
        api.get("/food"),
        api.get("/category"),
      ]);

      // Xử lý danh sách món ăn
      if (foodResponse.data.statusCode === 200) {
        setDataSource(foodResponse.data.data);
      } else {
        message.error(
          foodResponse.data.message || "Không thể lấy danh sách món ăn"
        );
      }

      // Xử lý danh mục
      if (categoryResponse.data.statusCode === 200) {
        setCategories(categoryResponse.data.data);
      } else {
        message.error("Không thể lấy danh mục");
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu: " + error.message);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  // 🛠 Thêm món mới
  const handleSubmit = async (values) => {
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      let imageUrl = null;
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj);
      }

      const newFood = {
        foodId: 0,
        name: values.name,
        description: values.description,
        image_url: imageUrl,
        category_id: values.category_id,
        status: "AVAILABLE",
      };

      const response = await api.post("/food", newFood);

      if (response.data.statusCode === 200) {
        setDataSource((prev) => [...prev, response.data.data]);
        setVisible(false);
        form.resetFields();
        setFileList([]);
        message.success("Thêm món ăn thành công!");
      } else {
        message.error(response.data.message || "Không thể thêm món ăn");
      }
    } catch (error) {
      message.error("Không thể thêm món ăn");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // 🛠 Cập nhật món ăn
  const handleUpdateFood = async (values) => {
    if (!editingFood || !editingFood.foodId) {
      message.error("Không tìm thấy món ăn để cập nhật!");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      let updatedFood = { ...editingFood, ...values };
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0];
        const url = await uploadFile(file.originFileObj);
        updatedFood.image_url = url;
      }

      const response = await api.put(
        `/food/${editingFood.foodId}`,
        updatedFood
      );

      if (response.data.statusCode === 200) {
        setDataSource((prev) =>
          prev.map((food) =>
            food.foodId === editingFood.foodId ? response.data.data : food
          )
        );
        setEditVisible(false);
        form.resetFields();
        setFileList([]);
        setEditingFood(null);
        message.success("Cập nhật món ăn thành công!");
      } else {
        message.error(response.data.message || "Không thể cập nhật món ăn");
      }
    } catch (error) {
      message.error("Không thể cập nhật món ăn: " + error.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // 🛠 Xóa món ăn
  const handleDelete = async (foodId) => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      await api.delete(`/food/${foodId}`);
      setDataSource((prev) => prev.filter((item) => item.foodId !== foodId));
      message.success("Xóa món ăn thành công!");
    } catch (error) {
      message.error("Không thể xóa món ăn");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  // Hiển thị modal维修 món ăn
  const showEditModal = (food) => {
    setEditingFood(food);
    form.setFieldsValue(food);
    setFileList(
      food.image_url
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: food.image_url,
            },
          ]
        : []
    );
    setEditVisible(true);
  };

  // Hiển thị modal thêm món mới
  const showAddModal = () => {
    form.resetFields();
    setFileList([]);
    setVisible(true);
  };

  // Xử lý ảnh
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
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Layout>
      <Content style={{ padding: "20px", background: "#fff", flex: 1 }}>
        {loading.table ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Button
              type="primary"
              onClick={showAddModal}
              style={{ marginBottom: 10 }}
              icon={<PlusOutlined />}
            >
              Thêm món
            </Button>
            <Table
              dataSource={dataSource}
              columns={[
                { title: "Tên món", dataIndex: "name", key: "name" },
                {
                  title: "Mô tả",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Hình ảnh",
                  dataIndex: "image_url",
                  key: "image_url",
                  render: (image_url) =>
                    image_url ? (
                      <img
                        src={image_url}
                        alt="Món ăn"
                        style={{ width: 200 }}
                      />
                    ) : (
                      "Không có ảnh"
                    ),
                },
                {
                  title: "Danh mục",
                  dataIndex: "category_id",
                  key: "category_id",
                },
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
                        onConfirm={() => handleDelete(record.foodId)}
                      >
                        <Button
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                          loading={loading.table} // Loading cho nút "Xóa"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </>
                  ),
                },
              ]}
              rowKey="foodId"
              loading={loading.table} // Loading cho bảng khi fetch hoặc xóa
            />

            {/* Modal thêm món ăn */}
            <Modal
              title="Thêm món ăn"
              open={visible}
              onCancel={() => {
                setVisible(false);
                form.resetFields();
                setFileList([]);
              }}
              onOk={() => form.submit()}
              confirmLoading={loading.submit} // Chỉ loading cho nút OK
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
                      message:
                        "Tên món ăn chỉ được chứa chữ cái và khoảng trắng!",
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
                    {
                      max: 200,
                      message: "Mô tả không được vượt quá 200 ký tự!",
                    },
                    {
                      pattern: /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
                      message:
                        "Mô tả chỉ được chứa chữ cái, số, khoảng trắng, dấu phẩy, dấu chấm và dấu gạch ngang!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hình ảnh">
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="category_id"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
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

            {/* Modal chỉnh sửa món ăn */}
            <Modal
              title="Chỉnh sửa món ăn"
              open={editVisible}
              onCancel={() => {
                setEditVisible(false);
                form.resetFields();
                setFileList([]);
              }}
              onOk={() => form.submit()}
              confirmLoading={loading.submit} // Chỉ loading cho nút OK
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
                      message:
                        "Tên món ăn chỉ được chứa chữ cái và khoảng trắng!",
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
                    {
                      max: 200,
                      message: "Mô tả không được vượt quá 200 ký tự!",
                    },
                    {
                      pattern: /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
                      message:
                        "Mô tả chỉ được chứa chữ cái, số, khoảng trắng, dấu phẩy, dấu chấm và dấu gạch ngang!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hình ảnh">
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="category_id"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
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

            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </>
        )}
      </Content>
    </Layout>
  );
}

export default ListFood;
