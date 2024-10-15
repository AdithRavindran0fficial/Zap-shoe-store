import React, { useState } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct } from "../../../../Redux/productSlice/productSlice";

export default function AdminProductUpdate() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productSlice);
  const { id } = useParams();
  const idNum = parseInt(id.slice(1), 10);
  const product = products?.data?.find((item) => item.id === idNum);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    Title: yup.string().required("This Field is Required"),
    Description: yup.string().required("This Field is Required"),
    Price: yup.number().required("This Field is Required").positive("Price must be positive").integer("Price must be an integer"),
    CategoryId: yup.number().required("This Field is Required"),
    img: yup
      .mixed()
      .required("This Field is Required")
      .test("fileSize", "File too large", (value) => {
        return value && value.size <= 2 * 1024 * 1024; // 2MB limit
      })
      .test("fileFormat", "Unsupported Format", (value) => {
        return value && ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
    Quantity: yup.number().required("This Field is Required").positive("Quantity must be positive").integer("Quantity must be an integer"),
  });

  const handleSubmit = async (values) => {
    try {
      const updated = Object.keys(values).some((key) => values[key] !== product[key]);

      if (updated) {
        await dispatch(updateProduct({ values, idNum }));
        await dispatch(fetchProducts());
        toast.success("Product updated successfully");
      } else {
        toast("No changes applied", { icon: "ℹ️" });
      }
      navigate("/admin/productPage");
    } catch (error) {
      toast.error("An error occurred while updating the product");
    }
  };

  return (
    <>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={() => setOpen(false)}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <DialogPanel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <Link to="/admin/productPage">
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Link>
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-10 lg:col-span-5">
                        <div className="group relative">
                          <img
                            src={product?.img}
                            alt={product?.title}
                            className="object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-12 lg:col-span-7">
                        <div>
                          <div className="mx-auto mt-5 max-w-screen-xl sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-lg">
                              <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                                Update Product
                              </h1>
                              <Formik
                                initialValues={{
                                  Title: product?.title || "",
                                  Description: product?.description || "",
                                  Price: product?.price || "",
                                  CategoryId: product?.category || "",
                                  Quantity: product?.quantity || "",
                                  img: null,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                              >
                                {({ isSubmitting, setFieldValue }) => (
                                  <Form className="overflow-y-auto lg:h-80 h-full mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg border-t sm:p-6">
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Product Title
                                      </label>
                                      <div className="relative">
                                        <Field
                                          name="Title"
                                          type="text"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          placeholder="Update Title"
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="Title"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Image
                                      </label>
                                      <div className="relative">
                                        <input
                                          name="img"
                                          type="file"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (file) {
                                              setFieldValue("img", file);
                                            }
                                          }}
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="img"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Description
                                      </label>
                                      <div className="relative">
                                        <Field
                                          name="Description"
                                          type="text"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          placeholder="Update Description"
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="Description"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Price
                                      </label>
                                      <div className="relative">
                                        <Field
                                          name="Price"
                                          type="number"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          placeholder="Update Price"
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="Price"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Quantity
                                      </label>
                                      <div className="relative">
                                        <Field
                                          name="Quantity"
                                          type="number"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          placeholder="Update Quantity"
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="Quantity"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400">
                                        Category ID
                                      </label>
                                      <div className="relative">
                                        <Field
                                          name="CategoryId"
                                          type="number"
                                          className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                                          placeholder="Update Category ID"
                                        />
                                        <ErrorMessage
                                          component="div"
                                          name="CategoryId"
                                          className="text-red-500 text-sm"
                                        />
                                      </div>
                                    </div>

                                    <button
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                                    >
                                      Update Product
                                    </button>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
