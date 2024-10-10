import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";

const INITIAL_STATE = {
  cart: [],
};
export const settingCart = createAsyncThunk(
  "cartSlice/settingCart",
  async (_, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem("id");
      if (!id) {
        return rejectWithValue("User ID not found");
      }

      const res = await api.get(`/user/${id}/cart`);

      return res.data?.data?.products;
    } catch (error) {
      console.error("Something went wrong!", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cartSlice/addToCartAsync",
  async (product, { getState }) => {
    try {
      // const state = getState();
      const id = localStorage.getItem("id");
      // let userCart = Array.isArray(state.cartSlice.cart)
      //   ? [...state.cartSlice.cart]
      //   : [];

      // const existingProductIndex = userCart.findIndex(
      //   (item) => item._id === product._id
      // );

      // if (existingProductIndex !== -1) {
      //   userCart = userCart.map((item, index) => {
      //     if (index === existingProductIndex) {
      //       return { ...item, quantity: item.quantity + product.quantity };
      //     }
      //     return item;
      //   });
      // } else {
      //   userCart.push({ ...product, quantity: product.quantity });
      // }

      // console.log(userCart);

      await api.post(`/user/${id}/cart`, {
        productId: product._id,
        quantity: product.quantity,
      });
      // console.log(state.cartSlice.cart.push(product))

      const res = await api.get(`/user/${id}/cart`);
      return res.data.data.products;
    } catch (error) {
      console.error("Something went wrong!", error.message);
      throw error;
    }
  }
);

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
      .addCase(settingCart.pending, (state) => {
        console.log("cart is loading");
      })
      .addCase(settingCart.rejected, (state) => {
        console.log("Error in fetching cart");
      })
      .addCase(settingCart.fulfilled, (state, action) => {
        console.log("cart updated successfully");
        state.cart = action.payload;
        // console.log(action.payload)
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
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
