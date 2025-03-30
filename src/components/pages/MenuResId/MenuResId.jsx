import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  message,
  Spin,
  Button,
  InputNumber,
  Modal,
  Select,
  Popconfirm,
} from "antd";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const MenuResId = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState({
    table: true,
    submit: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [price, setPrice] = useState(null);
  const user = useSelector(selectUser);

  // State cho chỉnh sửa giá
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [newPrice, setNewPrice] = useState(null);

  useEffect(() => {
    fetchMenu();
    fetchFoodList();
  }, [restaurantId]);

  const fetchFoodList = async () => {
    try {
      const response = await api.get("/food");
      let data = response.data?.data || [];
      data = data.filter((food) => food.foodId !== null);
      setFoodList(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách món ăn!");
    }
  };

  const fetchMenu = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    const restId = restaurantId || user?.restaurantId;
    if (!restId) {
      message.error("Lỗi: Không tìm thấy ID nhà hàng.");
      setLoading((prev) => ({ ...prev, table: false }));
      return;
    }
    try {
      const response = await api.get(`menu/restaurant/${restId}`);
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        const restaurantData = response.data.data[0];
        setMenuItems(restaurantData?.menuItems || []);
      } else {
        message.error("Không thể tải menu!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối API!");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const addToMenu = async () => {
    if (!selectedFood || !price || price <= 0) {
      message.warning("Vui lòng chọn món ăn và nhập giá hợp lệ!");
      return;
    }

    const restId = restaurantId || user?.restaurantId;
    if (!restId) {
      message.error("Lỗi: Không tìm thấy ID nhà hàng.");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const menuResponse = await api.get(`menu/restaurant/${restId}`);
      if (!menuResponse.data?.data || menuResponse.data.data.length === 0) {
        message.error("Lỗi: Không tìm thấy menu của nhà hàng.");
        return;
      }

      const restaurantMenuId = menuResponse.data.data[0].id;
      const payload = {
        restaurantMenuId: Number(restaurantMenuId),
        foodId: Number(selectedFood),
        price: Number(price),
      };

      const response = await api.post("/restaurant-menu-items", payload);
      const newItem = {
        ...response.data.data,
        foodName: foodList.find((food) => food.foodId === selectedFood)?.name,
        categoryName: foodList.find((food) => food.foodId === selectedFood)
          ?.categoryName,
        available: true,
      };
      setMenuItems((prev) => [...prev, newItem]);
      message.success("Đã thêm vào menu thành công!");
      setIsModalOpen(false);
      setSelectedFood(null);
      setPrice(null);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm món ăn!");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Mở modal chỉnh sửa giá
  const openEditModal = (itemId, currentPrice) => {
    setEditItemId(itemId);
    setNewPrice(currentPrice);
    setEditModalOpen(true);
  };

  // Cập nhật giá món ăn
  const updatePrice = async () => {
    if (!editItemId || !newPrice || newPrice <= 0) {
      message.warning("Vui lòng nhập giá hợp lệ!");
      return;
    }

    const restId = restaurantId || user?.restaurantId;
    if (!restId) {
      message.error("Lỗi: Không tìm thấy ID nhà hàng.");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const menuResponse = await api.get(`menu/restaurant/${restId}`);
      if (!menuResponse.data?.data || menuResponse.data.data.length === 0) {
        message.error("Lỗi: Không tìm thấy menu của nhà hàng.");
        return;
      }

      const restaurantMenuId = menuResponse.data.data[0].id;
      const menuItem = menuItems.find((item) => item.id === editItemId);
      if (!menuItem) {
        message.error("Lỗi: Không tìm thấy món ăn trong menu.");
        return;
      }

      const payload = {
        restaurantMenuId: Number(restaurantMenuId),
        price: Number(newPrice),
        isAvailable: menuItem.available,
      };

      const response = await api.put(
        `/restaurant-menu-items/${menuItem.id}`,
        payload
      );
      const updatedItem = {
        ...response.data.data,
        foodName: menuItem.foodName,
        categoryName: menuItem.categoryName,
        available: menuItem.available,
      };
      setMenuItems((prev) =>
        prev.map((item) => (item.id === editItemId ? updatedItem : item))
      );
      message.success("Cập nhật giá thành công!");
      setEditModalOpen(false);
      setEditItemId(null);
      setNewPrice(null);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật giá!");
      console.error("Lỗi API:", error.response?.data);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Xóa món ăn khỏi menu
  const deleteMenuItem = async (itemId) => {
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const response = await api.delete(`/restaurant-menu-items/${itemId}`);
      if (response.status === 200 || response.status === 204) {
        // 204 là mã thường dùng cho DELETE thành công
        setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
        message.success("Đã xóa món ăn khỏi menu thành công!");
      } else {
        message.error("Không thể xóa món ăn!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa món ăn!");
      console.error("Lỗi API:", error.response?.data);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 10 }}
      >
        Thêm Món Mới
      </Button>

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
        <Table
          dataSource={menuItems}
          rowKey={(record) => record.id || record.foodId}
          loading={loading.table}
        >
          <Table.Column title="Tên Món" dataIndex="foodName" key="foodName" />
          <Table.Column title="Giá (VND)" dataIndex="price" key="price" />
          <Table.Column
            title="Loại"
            dataIndex="categoryName"
            key="categoryName"
          />
          <Table.Column
            title="Tình trạng"
            render={(item) => (item.available ? "Còn hàng" : "Hết hàng")}
            key="available"
          />
          <Table.Column
            title="Hành động"
            render={(record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="primary" // Thêm màu xanh cho nút chỉnh sửa
                  onClick={() => openEditModal(record.id, record.price)}
                >
                  Chỉnh Sửa Giá
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa món này khỏi menu?"
                  onConfirm={() => deleteMenuItem(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger loading={loading.submit} type="primary">
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            )}
            key="actions"
          />
        </Table>
      )}

      {/* Modal Thêm Món Mới */}
      <Modal
        title="Thêm Món Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={addToMenu}
        confirmLoading={loading.submit}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn món ăn"
          onSelect={(value) => setSelectedFood(value)}
          value={selectedFood}
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
          value={price}
        />
      </Modal>

      {/* Modal Chỉnh Sửa Giá */}
      <Modal
        title="Chỉnh Sửa Giá"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={updatePrice}
        confirmLoading={loading.submit}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          value={newPrice}
          onChange={(value) => setNewPrice(value)}
        />
      </Modal>
    </div>
  );
};

export default MenuResId;
