import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaMoneyBillWave,
} from "react-icons/fa";
import api from "../../../../utils/axios";

export default function AdminHomePage() {
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const { products } = useSelector((state) => state.productSlice);
  const { users } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    api.get("/admin/orders").then((res) => {
      setTotalOrder(res.data.data.length);
    });
    api.get("/admin/analytics-revenue").then((res) => {
      setTotalRevenue(res.data.message.split(" ").pop());
    });
    api.get("/admin/analytics-products").then((res) => {
      setTotalSales(res.data.message.split(" ").pop());
    });
  }, []);

  return (
    <div className="md:ms-44 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 px-4 md:px-6 lg:px-8">
      <Link
        to="/admin/usersList"
        className="block bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-6 shadow-lg transform transition hover:scale-105 duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-4xl font-bold">{users?.data?.length || 0}</div>
            <div className="text-lg font-medium">Users</div>
          </div>
          <FaUsers className="text-4xl opacity-75" />
        </div>
      </Link>

      <Link
        to="/admin/productPage"
        className="block bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-lg p-6 shadow-lg transform transition hover:scale-105 duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-4xl font-bold">
              {products?.data?.length || 0}
            </div>
            <div className="text-lg font-medium">Products</div>
          </div>
          <FaBox className="text-4xl opacity-75" />
        </div>
      </Link>

      <Link
        to="/admin/usersList"
        className="block bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg p-6 shadow-lg transform transition hover:scale-105 duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-4xl font-bold">{totalOrder}</div>
            <div className="text-lg font-medium">Orders</div>
          </div>
          <FaShoppingCart className="text-4xl opacity-75" />
        </div>
      </Link>

      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg p-6 shadow-lg transform transition hover:scale-105 duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-4xl font-bold">{totalSales}</div>
            <div className="text-lg font-medium">Total Sales</div>
          </div>
          <FaDollarSign className="text-4xl opacity-75" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg p-6 shadow-lg transform transition hover:scale-105 duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-4xl font-bold">₹{totalRevenue}</div>
            <div className="text-lg font-medium">Total Revenue</div>
          </div>
          <FaMoneyBillWave className="text-4xl opacity-75" />
        </div>
      </div>
    </div>
  );
}
