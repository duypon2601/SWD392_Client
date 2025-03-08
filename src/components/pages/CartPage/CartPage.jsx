import { Table } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAll } from "../../redux/features/cartSlice";

function CartPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dataSource = useSelector((store) => store.cart);
  console.log("dataSource", dataSource);
  const dispatch = useDispatch();

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "ID",
      dataIndex: "food_id",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Image",
      dataIndex: "img",
      render: (text, record) => (
        <img src={record.img} alt={record.name} style={{ width: "50px" }} />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => dispatch(clearAll())}>Clean All</button>
      <Table
        rowKey={(record) => record.food_id}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={Array.isArray(dataSource.items) ? dataSource.items : []}
      />
    </div>
  );
}

export default CartPage;
