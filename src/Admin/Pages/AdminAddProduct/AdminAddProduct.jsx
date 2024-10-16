import { Field, Form, Formik, ErrorMessage } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Addproduct } from "../../../../Redux/productSlice/productSlice";

const AdminAddProduct = () => {
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    title: yup.string().required("This Field is Required"),
    description: yup.string().required("This Field is Required"),
    price: yup.number().required("This Field is Required"),
    category: yup
      .number()
      .required("This Field is Required")
      .typeError("Category must be a number"),
    quantity: yup
      .number()
      .required("This Field is Required")
      .min(1, "Quantity must be at least 1"),
    image: yup
      .mixed()
      .required("An image file is required")
      .test(
        "fileType",
        "Only JPEG and PNG files are supported",
        (value) => {
          return (
            value &&
            (value.type === "image/jpeg" || value.type === "image/png")
          );
        }
      ),
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("Title", values.title);
      formData.append("Description", values.description);
      formData.append("Price", values.price);
      formData.append("CategoryId", parseInt(values.category, 10));
      formData.append("Quantity", values.quantity);
      if (values.image) {
        formData.append("img", values.image);
      }

      // Dispatch the thunk to add product
       dispatch(Addproduct(formData));
      
      

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="drop-shadow-xl text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
            Add Products
          </h1>

          <Formik
            initialValues={{
              title: "",
              description: "",
              price: "",
              category: "",
              quantity: 1,
              image: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="overflow-y-auto sm:h-96 h-full mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 sm:ms-20">
                <p className="text-center text-lg font-medium">
                  Add products to your catalog
                </p>

                <div>
                  <label
                    htmlFor="title"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Product Title
                  </label>
                  <div className="relative">
                    <Field
                      name="title"
                      type="text"
                      className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                      placeholder="Enter Title"
                    />
                    <ErrorMessage
                      component="div"
                      name="title"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <Field
                      name="description"
                      as="textarea"
                      rows="4"
                      className="w-full rounded-md mb-2 border-gray-200 p-3 text-sm shadow-sm border"
                      placeholder="Enter Description"
                    />
                    <ErrorMessage
                      component="div"
                      name="description"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <Field
                      name="price"
                      type="text"
                      className="w-full rounded-md mb-2 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                      placeholder="Enter Price"
                    />
                    <ErrorMessage
                      component="div"
                      name="price"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Category (Number)
                  </label>
                  <div className="relative">
                    <Field
                      name="category"
                      type="number"
                      className="w-full rounded-md mb-4 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                      placeholder="Enter Category"
                    />
                    <ErrorMessage
                      component="div"
                      name="category"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Quantity
                  </label>
                  <div className="relative">
                    <Field
                      name="quantity"
                      type="number"
                      className="w-full rounded-md mb-4 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                      placeholder="Enter Quantity"
                    />
                    <ErrorMessage
                      component="div"
                      name="quantity"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block ps-1.5 pb-1 text-sm text-start font-medium leading-6 text-gray-400"
                  >
                    Upload Image
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                    }}
                    className="w-full rounded-md mb-4 border-gray-200 p-3 pe-12 text-sm shadow-sm border"
                  />
                  <ErrorMessage
                    component="div"
                    name="image"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Add Product
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
