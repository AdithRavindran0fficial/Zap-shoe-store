import React,{ Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  XMarkIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import api from "../../../../utils/axios";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminOrderList() {
  const { id } = useParams();
  const idNum = id.slice(1);
  const [open, setOpen] = useState(true);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetch = async ()=>{
      try{
        const resp = await axios.get(`https://localhost:7211/api/Order/UserOrders?id=${id.slice(1)}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        // console.log(resp.data.data)
        setUserOrders(resp.data.data);
      }
      catch(error){
        console.log("something went wrong");
        
      }
    }
    fetch()
    
      
  }, [idNum]);

  return (
    <div
  className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-opacity ${
    open ? "opacity-100" : "opacity-0"
  }`}
>
  <div className="absolute inset-0 backdrop-blur-md bg-gray-900 bg-opacity-30" />
  <div className="relative flex justify-center items-center h-screen p-4">
    <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
      <Link to="/admin/userslist">
        <button
          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </Link>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-md shadow-md border border-gray-200"
            >
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Order #{index + 1}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Product Info
                  </h2>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Product Name: </span>
                    {order.product_Name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Quantity: </span>
                    {order.qty}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Product ID: </span>
                    {order.product_Id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Total: </span>
                    ₹{order.total}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-2 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4 text-indigo-500" />
                  <p className="text-sm text-gray-700">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-700 font-semibold">
                    Total Amount: ₹{order.total}
                  </p>
                </div>
                <p className="text-sm text-red-600 font-semibold">
                  Order ID: {order.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            No Orders Found
          </p>
        </div>
      )}
    </div>
  </div>
</div>
  )
}
