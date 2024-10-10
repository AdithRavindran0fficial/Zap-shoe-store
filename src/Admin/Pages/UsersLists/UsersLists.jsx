import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SearchBar from "../../../G-Components/SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../../../Redux/usersSlice/usersSlice";
import api from "../../../../utils/axios";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function UsersLists() {
  const navigate = useNavigate();

  const { filteredUsers } = useSelector((state) => state.usersSlice);
  const dispatch = useDispatch();
  const userLogin = localStorage.getItem("id");

  const handleDeleteUser = (users) => {
    api
      .delete(`/admin/${users._id}/deleteuser`)
      .then(() => {
        dispatch(deleteUser(users));
        toast.success(`User '${users.username}' deleted successfully`);
      })
      .catch((err) => toast.error("Failed to delete user"));
  };
  // console.log(filteredUsers);
  return (
    <>
      <SearchBar />
      <div className="md:ms-64 overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-10">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Id
              </th>
              <th className="sticky left-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Email
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Order
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center tracking-wider">
            {filteredUsers.data?.map((user) => (
              <tr key={user._id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ">
                  {user._id}
                </td>
                <td className="sticky left-0 bg-white whitespace-nowrap px-4 py-2 text-gray-700">
                  {user.username}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <button
                    onClick={() => {
                      navigate(`/admin/userslist/user/:${user._id}/orders`);
                    }}
                    type="button"
                    className="px-2.5 py-1 rounded-md bg-lime-600 text-white font-semibold text-base  shadow hover:bg-lime-700 focus:outline-none  focus:ring-lime-700"
                  >
                    View Orders
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <button
                    onClick={() => handleDeleteUser(user)}
                    type="button"
                    className="px-4 py-1 bg-red-500 text-white font-semibold text-base rounded shadow hover:bg-red-600 focus:outline-none  focus:ring-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
