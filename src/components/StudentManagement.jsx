import {
  Form,
  Input,
  Modal,
  Table,
  InputNumber,
  Upload,
  Popconfirm,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import uploadFile from "../utils/file";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const api = "https://6764394452b2a7619f5be19c.mockapi.io/Student";

  const fetchStudent = async () => {
    try {
      const response = await axios.get(api);
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Nhan vien:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${api}/${studentId}`);
      alert("Xóa Nhan vien thành công!");
      fetchStudent(); // Cập nhật danh sách sinh viên
    } catch (error) {
      console.error("Lỗi khi xóa Nhan vien:", error);
    }
  };

  const handleSubmitStudent = async (values) => {
    try {
      if (fileList.length > 0) {
        const file = fileList[0];
        console.log(file);
        const url = await uploadFile(file.originFileObj);
        students.image = url;
        console.log("a", students.image);
      }

      await axios.post(api, students);
      alert("Thêm Nhan vien thành công!");
      fetchStudent();
      handleCloseModal();
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm Nhan vien:", error);
    }
  };

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
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Ảnh" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (id) => (
        <Popconfirm
          title="Xóa sinh viên"
          description="Bạn có chắc chắn muốn xóa sinh viên này không?"
          onConfirm={() => handleDeleteStudent(id)}
        >
          <Button type="primary" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ color: "black" }}>Quản lý Nhan vien</h1>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: 16 }}
      >
        Thêm Nhan vien mới
      </Button>
      <Table dataSource={students} columns={columns} rowKey="id" />

      <Modal
        title="Thêm Nhan vien"
        open={openModal}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmitStudent}>
          <Form.Item
            label="Tên Nhan vien"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên Nhan vien!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mã Nhan vien"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã Nhan vien!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Điểm"
            name="score"
            rules={[
              { required: true, message: "Vui lòng nhập điểm!" },
              {
                type: "number",
                min: 0,
                max: 10,
                message: "Điểm phải từ 0 đến 10!",
              },
            ]}
          >
            <InputNumber min={0} max={10} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Ảnh" name="image">
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
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title="Xem trước Ảnh"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Xem trước" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default StudentManagement;
