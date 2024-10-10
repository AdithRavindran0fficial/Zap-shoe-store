import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export const settingWishList = createAsyncThunk(
  "wishlist/settingWishList",
  async (_, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem("id");
      const response = await api.get(`/user/${id}/wishlists`);
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
      const id = localStorage.getItem("id");
      await api.post(`/user/${id}/wishlists`, { productId: product._id });
      dispatch(settingWishList());
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
      await api.delete(`/user/${id}/wishlists`, { data: { productId } });
      dispatch(settingWishList());
      return productId;
    } catch (error) {
      toast.error("Failed to remove from wishlist");
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
