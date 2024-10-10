import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";
import axios from "axios";

const INITIAL_STATE = {
  cart: [],
};
export const FetchingCart = createAsyncThunk(
  "cartSlice/FetchingCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/Cart/Cart")
      return res.data.data
    } catch (error) {
      console.error("Something went wrong!", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cartSlice/addToCartAsync",
  async ({product,toast,dispatch}, { getState }) => {
    try {   
      // const id = localStorage.getItem("id");
      console.log(`going to post product to cart this from thunk this is id ${product.id}`);
      console.log(localStorage.getItem("token"))
      
     const res =  await api.post("https://localhost:7211/api/Cart/Addtocart", {
        productId:product.id
      },
    );
  console.log(`${res.data.message} this from addto cart function thunk`);
    if(res.status==200){
      toast.success("Product added Successfully");
      dispatch(FetchingCart())
    }
   
  }
  catch(error){
    if(error.response.status==401){
      toast.error("Authentication problem")
    }
    if(error.response.status==400){
      toast.error("Item already in cart")     
    }
    if(error.response.status==500){
      toast.error("Something went wrong")     
    }
  }

});

export const removeFromCartAsync = createAsyncThunk(
  "cartSlice/removeFromCartAsync",
  async (productId, { getState }) => {
    try {
      const id = localStorage.getItem("id");

      const deleteProduct = await api.delete(`/user/${id}/cart`, {
        data: { productId: productId },
      });
      const currentProducts = deleteProduct?.data?.data?.products;

      if (currentProducts.length > 0) {
        const res = await api.get(`/user/${id}/cart`);
        if (res?.data?.data?.products) {
          return res.data.data.products;
        } else {
          throw new Error("Cart not found or empty");
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

export const quantityIncrementAsync = createAsyncThunk(
  "cartSlice/quantityIncrementAsync",
  async (product, { getState }) => {
    try {
      // const state = getState();
      const id = localStorage.getItem("id");
      // const userCart = Array.isArray(state.cartSlice.cart)
      //   ? state.cartSlice.cart.map((item) => {
      //       if (item._id === product._id) {
      //         return { ...item, quantity: item.quantity + 1 };
      //       }
      //       return item;
      //     })
      //   : [];

      await api.post(`user/${id}/cart`, {
        productId: product.productId._id,
        quantity: product.quantity,
        action: "increment",
      });
      const res = await api.get(`/user/${id}/cart`);
      return res.data.data.products;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

export const quantityDecrementAsync = createAsyncThunk(
  "cartSlice/quantityDecrementAsync",
  async (product, { getState }) => {
    try {
      // const state = getState();
      const id = localStorage.getItem("id");
      // const userCart = Array.isArray(state.cartSlice.cart);
      // ? state.cartSlice.cart.map((item) => {
      //     if (item._id === product._id && item.quantity > 1) {
      //       return { ...item, quantity: item.quantity - 1 };
      //     }
      //     return item;
      //   })
      // : [];

      await api.post(`/user/${id}/cart`, {
        productId: product.productId._id,
        quantity: product.quantity,
        action: "decrement",
      });
      const res = await api.get(`/user/${id}/cart`);
      return res.data.data.products;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: INITIAL_STATE,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchingCart.pending, (state) => {
        console.log("cart is loading");
      })
      .addCase(FetchingCart.rejected, (state) => {
        console.log("Error in fetching cart");
      })
      .addCase(FetchingCart.fulfilled, (state, action) => {
        console.log("cart updated successfully");
        state.cart = action.payload;
        // console.log(action.payload)
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // state.cart = action.payload;
        console.log("Succesfuly aded this from inside addto slice")
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(quantityIncrementAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(quantityDecrementAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default cartSlice.reducer;

export const {
  addToCart,
  removeFromCart,
  quantityIncrement,
  quantityDecrement,
  clearCart,
} = cartSlice.actions;
