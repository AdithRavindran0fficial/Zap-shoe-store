import { Fragment, useContext, useEffect, useState } from "react";
import logo from "../../../Assets/Logo.png";
import fontLogo from "../../../Assets/font.png";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";
import profileIcon from "../../../Assets/user-icon.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
// import axios from "axios";
import api from "../../../../utils/axios";
import { toast } from "react-toastify";
// import { CartContext } from "../../Componet/Contexts/Contexts";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../Redux/logSlice/logSlice";
import { Categorize} from "../../../../Redux/productSlice/productSlice";
import { settingWishList } from "../../../../Redux/wishlistSlice/wishlistSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  // const {// logout,// isLoggedIn,// setCategory,// categorize,// category,// filterUsers,} = useContext(CartContext);
  // const { category } = useSelector((state) => state.productSlice);
  const { filteredUsers } = useSelector((state) => state.usersSlice);
  const { cart } = useSelector((state) => state.cartSlice);
  const { wishlist } = useSelector((state) => state.wishlistSlice);
  const { isLogged } = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  const userLogin = localStorage.getItem("id");
  const [userOrders, setUserOrders] = useState([]);
  const [userWish, setUserWish] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showWishList, setShowWishList] = useState(false);
  // const user = filteredUsers?.find((user) => user.id === userLogin);
  // console.log(filteredUsers);
  

  useEffect(() => {
    dispatch(settingWishList())
    // console.log(wishlist);
      // console.log(user);
      
        // console.log(wishlist)
        setUserWish(wishlist);
        // console.log(`this is whishlish ${userWish}`)
      
    
  }, [userLogin, filteredUsers, wishlist]);

  // console.log(wishlist);
  // console.log(userOrders);
  const handleShowOrders = () => {
    setShowOrders(true);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };
  const handleCategory = (e) => {
    // categorize(category);
   let cat = e.target.value
   console.log(cat)
    dispatch(Categorize({cat}));
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const validationSchema = yup.object({
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is Required"),
    state: yup.string().required("State is Required"),
    contact: yup
      .string()
      .required("Contact is Required")
      .matches(/^\d{10}$/, "Contact must be 10 digits"),
    pincode: yup
      .string()
      .required("Pin Code is required")
      .matches(/^[1-9][0-9]{5}$/, "Invalid Pin Code"),
  });
  // console.log(user);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const updateUser = {
        address: values.address,
        city: values.city,
        state: values.state,
        contact: values.contact,
        pincode: values.pincode,
      };

      await api
        .patch(`/user/${user._id}/updateinfo`, updateUser)
        .then(() => {
          console.log("Update successful");
          toast.success("Address updated successfully");
        })
        .catch((err) => {
          console.log("Error updating", err.message);
          // toast.error("Update failed");
        });

      resetForm();
      setShowProfile(false);
    } catch (err) {
      console.log("Error caught", err);
      // toast.error("Something went wrong");
    }
  };

  const [loading, setLoading] = useState(false);

const handleRefundRequest = async (orderId) => {
  try {
    setLoading(true);
    const response = await api.post(`/user/order/${orderId}/refund`);

    if (response.data.success) {
      toast.success("Refund request submitted!");
    } else {
      toast.error(response.data.message || "Refund request failed.");
    }
  } catch (error) {
    console.error("Error in handleRefundRequest:", error);  // Log the error for debugging
    toast.error("Error submitting refund request. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <header className="bg-white ">
        <div className="fixed bg-white w-full top-0 z-20">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between p-6  lg:px-8 "
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <Link to="/">
                <span className="sr-only"> Company Logo</span>
                <img
                  className="sm:h-8 md:h-12 h-4  w-auto"
                  src={fontLogo}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
              {/* {user?.role == "Admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Go to admin
                </Link>
              )} */}

              <Link
                to="/"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Contact
              </Link>
              <select
                className="text-sm font-semibold leading-6 text-gray-900 text-center"
                onChange={handleCategory}
              >
                <option
                  className="text-sm font-semibold leading-6 text-gray-900 text-center"
                  value="all"
                >
                  Categories
                </option>
                <option
                  className="text-sm font-semibold leading-6 text-gray-900 text-center"
                  value="all"
                >
                  All
                </option>
                <option
                  className="text-sm font-semibold leading-6 text-gray-900 text-center"
                  value="men"
                >
                  Men
                </option>
                <option
                  className="text-sm font-semibold leading-6 text-gray-900 text-center"
                  value="women"
                >
                  Women
                </option>
              </select>
            </PopoverGroup>
            <div
              className="relative text-sm font-semibold leading-6 w-6 sm:w-14 lg:ms-20 text-gray-900 cursor-pointer"
              onClick={() => setShowWishList(true)}
            >
              {wishlist?.length > 0 && (
                <span className="absolute  bg-red-600 text-white text-xs font-semibold rounded-full w-3 h-3 items-center justify-center md:ml-24 "></span>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-7 h-7 md:ml-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.51 6.51 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </div>

            <Link
              to="/cart"
              className="text-sm font-semibold leading-6 w-6 sm:w-14 lg:ms-20 text-gray-900"
            >
              {cart?.length > 0 && (
                <span className="absolute  bg-red-600 text-white text-xs font-semibold rounded-full w-3 h-3 items-center justify-center ml-4 "></span>
              )}
              <img
                className="h-6 w-auto "
                src="https://static-00.iconduck.com/assets.00/shopping-cart-icon-2048x2047-gv68pvgw.png"
                alt="cart"
              />
            </Link>

            {isLogged ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lime-400">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profileIcon}
                      alt="ProfileIcon"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        onClick={handleShowProfile}
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Update Info
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        onClick={handleShowOrders}
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        View Orders
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        to={"/login"}
                        onClick={() => {
                          logout;
                          localStorage.clear();
                        }}
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Log out
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                to={"/login"}
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
              >
                Log in
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </nav>
        </div>
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a className="-m-1.5 p-1.5">
                <span className="sr-only">Company Logo</span>
                <img
                  className="h-12 w-auto"
                  src={fontLogo}
                  alt="Company Logo"
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <select
                    onChange={handleCategory}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    <option value="all">Categories</option>
                    <option value="all">All</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </Link>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    to="/products"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Products
                  </Link>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    to="/contact"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Contact
                  </Link>
                </div>

                <div className="py-6">
                  {!isLogged && (
                    <Link
                      onClick={() => {
                        logout;
                        localStorage.clear();
                      }}
                      to={"/login"}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      "Log in"
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {showOrders && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 backdrop-blur-lg">
          <div className="relative bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8">
            <button
              type="button"
              onClick={() => setShowOrders(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              Order Details
            </h2>

            {userOrders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {userOrders
                  .flatMap((innerArray) => innerArray)
                  .map((order) => {
                    const isDelivered = order.products.every(
                      (product) => product.isDelivered
                    );
                    return (
                      <div
                        key={order._id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
                        style={{ minHeight: "350px" }}
                      >
                        <div className="p-4">
                          {order.products.map((product) => (
                            <Fragment key={product._id}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="w-24 h-24">
                                  <img
                                    src={product.productId.imageSrc}
                                    alt={product.productId.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {product.productId.title}
                                  </h3>
                                  <p className="text-gray-700">
                                    Color: {product.productId.color}
                                  </p>
                                  <p className="text-gray-700">
                                    Quantity: {product.quantity}
                                  </p>
                                  <p className="text-gray-700">
                                    Price: ₹{product.price}
                                  </p>
                                  <p className="text-gray-700">
                                    Total: ₹
                                    {product.productId.price * product.quantity}
                                  </p>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>

                         <div className="p-4 bg-gray-100 mt-auto flex flex-col items-center">
                          <p
                            className={`text-sm ${isDelivered ? "text-green-500" : "text-yellow-500"
                              }`}
                          >
                            Status: {isDelivered ? "Delivered" : "Pending"}
                          </p>
                          {!order.isRefundRequested && !isDelivered ? (
                            <button
                              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                              onClick={() => handleRefundRequest(order._id)}
                              disabled={loading}
                            >
                              {loading ? "Requesting..." : "Cancel Order"}
                            </button>
                          ) : (
                            <span className="text-gray-500">
                              {isDelivered
                                ? "Order Delivered"
                                : "Order Canceled"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="p-5 text-center text-gray-700">No Orders Found</p>
            )}
          </div>
        </div>
      )}
      
      {showWishList && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 backdrop-blur-lg">
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <button
              type="button"
              onClick={() => setShowWishList(false)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              Your Wishlist
            </h2>
            {userWish?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left bg-gray-50 shadow-lg rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-gray-700 font-semibold">
                        Product Image
                      </th>
                      <th className="px-6 py-3 text-gray-700 font-semibold">
                        Product Title
                      </th>
                      {/* <th className="px-6 py-3 text-gray-700 font-semibold">
                        Product Color
                      </th> */}
                      {/* <th className="px-6 py-3 text-gray-700 font-semibold">
                        Product Quantity
                      </th> */}
                      <th className="px-6 py-3 text-gray-700 font-semibold">
                        Product Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userWish?.map((wish) => (
                      <tr
                        key={wish.id}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        <td className="px-4 py-4">
                          <img
                            src={wish.img}
                            alt={wish.title}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {wish.title}
                        </td>
                        {/* <td className="px-6 py-4 text-gray-700">
                          {wish.productId.color}
                        </td> */}
                        {/* <td className="px-6 py-4 text-gray-700">
                          {wish.quantity}
                        </td> */}
                        <td className="px-6 py-4 text-gray-700">
                          ₹{wish.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-700 font-semibold p-6">
                No items in your wishlist.
              </p>
            )}
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed top-0 left-0 w-full h-full flex  items-center justify-center bg-gray-800 bg-opacity-50 z-50 backdrop-blur-lg ">
          <div className="bg-white p-5 lg:w-1/4 rounded-lg shadow overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowProfile(false)}
              className="text-gray-950 hover:text-gray-400 "
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6 end-0" aria-hidden="true" />
            </button>
            <h3 className="text-center font-bold text-xl p-3">Enter Details</h3>
            <Formik
              initialValues={{
                address: `${user.address}`,
                city: `${user.city}`,
                state: `${user.state}`,
                contact: `${user.contact}`,
                pincode: `${user.pincode}`,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address
                    </label>
                    <div className="mt-2 mb-4">
                      <Field
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter Address"
                        className="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div className="mt-2 mb-4">
                      <Field
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Enter City"
                        className="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <label
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State
                    </label>
                    <div className="mt-2 mb-4">
                      <Field
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Enter State"
                        className="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contact No.
                    </label>
                    <div className="mt-2 mb-4">
                      <Field
                        id="contact"
                        name="contact"
                        type="text"
                        placeholder="Enter Contact"
                        className="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium leading-6  text-gray-900"
                    >
                      Pin Code
                    </label>
                    <div className="mt-2">
                      <Field
                        id="pincode"
                        name="pincode"
                        type="text"
                        placeholder="Enter Pincode"
                        className="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      disabled={isSubmitting}
                    >
                      Update
                    </button>
                    <ErrorMessage
                      name="submit"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <main className="pt-24">
        <Outlet />
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-screen-xl  text-center space-y-8 px-4 py-10 sm:px-6 lg:space-y-16 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-teal-600">
              <img
                className="mx-auto h-16 w-auto"
                src={logo}
                alt="Company Logo"
              />
            </div>
            <span className="text-xs text-gray-500">
              &copy; 2021 Kazpix.in All rights reserved.
            </span>
            <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
              <li>
                <a
                  href="https://facebook.com"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Facebook</span>

                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://instagram.com"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Instagram</span>

                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://x.com"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Twitter</span>

                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://github.com"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">GitHub</span>

                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}