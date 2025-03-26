import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, message, Spin, Button, InputNumber, Modal, Select } from "antd";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const MenuResId = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [price, setPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchMenu();
    fetchFoodList();
  }, [restaurantId]);

  // Lấy danh sách món ăn từ API
  const fetchFoodList = async () => {
    try {
      const response = await api.get("/food");
      let data = response.data?.data || [];

      console.log(" Danh sách món ăn từ API:", data);
      console.log("du leiu",user.restaurantId);

      // Lọc bỏ món ăn không hợp lệ
      data = data.filter((food) => food.foodId !== null);

      console.log("✅ Danh sách hợp lệ:", data);

      setFoodList(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách món ăn!");
    }
  };

  // Lấy menu của nhà hàng
  const fetchMenu = async () => {
    setLoading(true);
    const restId = restaurantId || user?.restaurantId;
    if (!restId) {
      message.error("Lỗi: Không tìm thấy ID nhà hàng.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`menu/restaurant/${restId}`);
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        const restaurantData = response.data.data[0];
        setMenuItems(restaurantData?.menuItems || []);
        setIsActive(restaurantData?.active || false);
      } else {
        message.error("Không thể tải menu!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm món ăn vào menu
  const addToMenu = async () => {
    console.log("selectedFood:", selectedFood, " | price:", price);
  
    if (!selectedFood || !price || price <= 0) {
      message.warning("Vui lòng chọn món ăn và nhập giá hợp lệ!");
      return;
    }
  
    const restId = restaurantId || user?.restaurantId;
    if (!restId) {
      message.error("Lỗi: Không tìm thấy ID nhà hàng.");
      return;
    }
  
    try {
      // Gọi API để lấy restaurantMenuId
      const menuResponse = await api.get(`menu/restaurant/${restId}`);
      if (!menuResponse.data?.data || menuResponse.data.data.length === 0) {
        message.error("Lỗi: Không tìm thấy menu của nhà hàng.");
        return;
      }
      
      const restaurantMenuId = menuResponse.data.data[0].id; // Lấy ID menu đầu tiên
      console.log("restaurantMenuId lấy từ API:", restaurantMenuId);
  
      const payload = {
        restaurantMenuId: Number(restaurantMenuId),
        foodId: Number(selectedFood),
        price: Number(price),
      };
  
      console.log("Gửi dữ liệu lên API:", payload);
  
      const response = await api.post("/restaurant-menu-items", payload);
      console.log("Phản hồi từ API:", response.data);
      message.success("Đã thêm vào menu thành công!");
      setIsModalOpen(false);
      fetchMenu();
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "Lỗi khi thêm món ăn!");
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 10}}>
        Thêm Món Mới
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={menuItems} rowKey={(record) => record.id || record.foodId}>
          <Table.Column title="Tên Món" dataIndex="foodName" key="foodName" />
          <Table.Column title="Giá (VND)" dataIndex="price" key="price" />
          <Table.Column title="Loại" dataIndex="categoryName" key="categoryName" />
          <Table.Column
            title="Tình trạng"
            render={(item) => (item.available ? "Còn hàng" : "Hết hàng")}
            key="available"
          />
        </Table>
      )}

      <Modal
        title="Thêm Món Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={addToMenu}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn món ăn"
          onSelect={(value) => {
            console.log("🔹 Món được chọn:", value);
            setSelectedFood(value);
          }}
        >
          {foodList.map((food) => (
            <Select.Option key={food.foodId} value={food.foodId}>
              {food.name}
            </Select.Option>
          ))}
        </Select>

        <InputNumber
          min={0}
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Nhập giá"
          onChange={(value) => setPrice(value)}
        />
      </Modal>
    </div>
  );
};

export default MenuResId;
