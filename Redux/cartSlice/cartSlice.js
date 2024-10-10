import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";
import axios from "axios";
import toast from "react-hot-toast";

const INITIAL_STATE = {
  cart: [],
};
export const FetchingCart = createAsyncThunk(
  "cartSlice/FetchingCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://localhost:7211/api/Cart/Cart",{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(`this is from fetching carts ${res.data}`);
      
      return res.data.data
    } catch (error) {
      console.error("Something went wrong!", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cartSlice/addToCartAsync",
  async ({product,toast}, { getState }) => {
    try {   
      // const id = localStorage.getItem("id");
      console.log(`going to post product to cart this from thunk this is id ${product.id}`);
      console.log(localStorage.getItem("token"))
      
     const res =  await axios.post("https://localhost:7211/api/Cart/Addtocart", {
        productId:product.id
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  console.log(`${res.data.message} this from addto cart function thunk`);
    if(res.status==200){
      toast.success("Product added Successfully");
      return res.data.data
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
      toast.error("Internal server issue")    
    }
  }

});

export const removeFromCartAsync = createAsyncThunk(
  "cartSlice/removeFromCartAsync",
  async ({product,dispatch,toast}, { getState }) => {
    try {
      const resp = await axios.delete(`https://localhost:7211/api/Cart/Remove?productid=${product.id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
        
      }
    )
    if(resp==200){
      dispatch(FetchingCart())
    }
      
      }
     catch (error) {
      console.log("something went wrong!");
      toast.error("something went wrong")
    }
  }
);

export const quantityIncrementAsync = createAsyncThunk(
  "cartSlice/quantityIncrementAsync",
  async({product,toast,dispatch})=>{
    try{
      const response = await axios.put("https://localhost:7211/api/Cart/increaseqty",{
        productId : product.id
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    if(response==200){
      dispatch(FetchingCart())
    }
  

    }
    catch(error){
      toast("something went wrong")
    }
    
  }
);

export const quantityDecrementAsync = createAsyncThunk(
  "cartSlice/quantityDecrementAsync",
  async ({product,dispatch,toast}, { getState }) => {
    try {
      const response = await axios.put("https://localhost:7211/api/Cart/decreaseqty",{
        productId:product.id
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    if(response.status==200){
      dispatch(FetchingCart())
    } 
    }
    catch(error){
      toast.error("something went wrong")
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
