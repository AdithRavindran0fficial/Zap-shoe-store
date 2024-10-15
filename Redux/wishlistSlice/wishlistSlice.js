import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import axios from "axios";

export const settingWishList = createAsyncThunk(
  "wishlist/settingWishList",
  async (_, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem("id");
      const response = await axios.get(`https://localhost:7211/api/WhishList/all`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      // console.log(response.data.data)
      return response.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch wishlist");
    }
  }
);

export const addToWishListAsync = createAsyncThunk(
  "wishlist/addToWishListAsync",
  async (product, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`https://localhost:7211/api/WhishList/Add?productid=${product.id}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      if(res.status==200){
        dispatch(settingWishList());
      }  
      return product;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Product already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
      return rejectWithValue("Failed to add to wishlist");
    }
  }
);

export const removeFromWishListAsync = createAsyncThunk(
  "wishlist/removeFromWishListAsync",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const id = localStorage.getItem("id");
      await axios.delete(`https://localhost:7211/api/WhishList/Remove?id=${productId}`, {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch(settingWishList());
      return productId;
    } catch (error) {
      // toast.error("Failed to remove from wishlist");
      return rejectWithValue("Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(settingWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(settingWishList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlist = action.payload;
      })
      .addCase(settingWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToWishListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishListAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addToWishListAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromWishListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishListAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeFromWishListAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
