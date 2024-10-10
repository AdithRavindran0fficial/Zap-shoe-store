import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminProtect({ element }) {
  const { users } = useSelector((state) => state.usersSlice);
  const id = localStorage.getItem("id");
  const [isAuthorized, setIsAuthorized] = useState(null);

  // console.log(users);

  useEffect(() => {
    if (users?.data) {
      const user = users?.data?.find((user) => user._id === id);
      if (user?.role === "admin") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        toast.error("Admin only Access");
      }
    }
  }, [users, id]);
  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-50"></div>
        <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
      </div>
    );
  }

  if (isAuthorized) {
    return element;
  }

  return <Navigate to="/" />;
}
