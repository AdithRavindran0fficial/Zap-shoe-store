import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const GenerateOrderId = async(total)=>{
    try{
        const res = await axios.post(`https://localhost:7211/api/Order/order-create?price=${total}`,{},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        if(res.status==200){
            return res.data.data
        }
    }catch(error){
        toast("Order id cannot be generated right now")
    }

}

const PaymentPage = () => {
    const[raz,setraz] = useState(null)
    const navigate  = useNavigate()
  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const validationSchema = Yup.object().shape({
    UserName: Yup.string().required('Name is required'),
    UserEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    UserPhone: Yup.string().required('Phone number is required'),
    UserAddress: Yup.string().required('Address is required'),
  });
  const { cart } = useSelector((state) => state.cartSlice);
  const Subtotal = cart?.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);


  const OrderPlace = async(values)=>{
    try{
        const token = localStorage.getItem("token")
        const resp = await axios.post("https://localhost:7211/api/Order",{
            userName: values.UserName,
            userEmail: values.UserEmail,
            userPhone: values.UserPhone,
            userAddress: values.UserAddress
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(resp.status==200){
            toast.success("Order placed")
            navigate("/")
        }

    }catch(error){
        toast.error("Order cannot be placed")
    }
    
  }

//   const veryPayment = async () => {
//     try {
//       let response = await axios.post("https://localhost:7211/api/Order/payment",{
//         razorpay_order_id : raz.razorpay_order_id,
//         razorpay_payment_id : raz.razorpay_payment_id,
//         razorpay_signature : raz.razorpay_signature

//       },{
//         headers : {
//           "Authorization" : `Bearer ${}`
//         }
//       })
//       return await response.data.data
//     }catch(err) {
//       console.log(err)
//     }
//   }

//   const handleSubmit = async (values) => {
//     console.log('Form values:', values);
//     const orderid = await GenerateOrderId(Subtotal);
    
//     // Create options for the Razorpay payment
//     const options = {
//       key: 'rzp_test_wL1B6IUAUSnQqu', // Enter the Razorpay API key here
//       amount: Subtotal * 100, // Amount in paise (e.g., Rs. 500 = 50000 paise)
//       currency: 'INR',
//       name: 'ZAP',
//       description: 'Test Transaction',
//       handler: async function (response) {
//         setraz({
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_order_id: orderid,
//           razorpay_signature: response.razorpay_signature,
//         });
  
//         // Only call veryPayment if raz is set
//         if (raz) {
//           const res = await veryPayment();
//           if (res) {
//             alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
//             OrderPlace(values);
//           }
//         } else {
//           toast.error("Payment details are missing.");
//         }
//       },
//       prefill: {
//         name: values.UserName,
//         email: values.UserEmail,
//         contact: values.UserPhone,
//       },
//       notes: {
//         address: values.UserAddress,
//       },
//       theme: {
//         color: '#3399cc',
//       },
//     };
  
//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
  
//   };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Order Form</h2>
      <Formik
        initialValues={{
          UserName: '',
          UserEmail: '',
          UserPhone: '',
          UserAddress: '',
        }}
        validationSchema={validationSchema}
        onSubmit={OrderPlace}
      >
        {() => (
          <Form>
            <div className="mb-4">
              <label htmlFor="UserName" className="block text-gray-700">
                Name
              </label>
              <Field
                type="text"
                name="UserName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="UserName" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="UserEmail" className="block text-gray-700">
                Email
              </label>
              <Field
                type="email"
                name="UserEmail"
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="UserEmail" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="UserPhone" className="block text-gray-700">
                Phone
              </label>
              <Field
                type="text"
                name="UserPhone"
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="UserPhone" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="UserAddress" className="block text-gray-700">
                Address
              </label>
              <Field
                as="textarea"
                name="UserAddress"
                rows="4"
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="UserAddress" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Submit Order & Pay
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentPage;
