import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";
import axios from "axios";
import toast from "react-hot-toast";
// import { fetchUsers } from "../usersSlice/usersSlice";
// import { build } from "vite";

export const fetchProducts = createAsyncThunk(
  "productSlice/fetchProducts",
  async () => {
    try {
      const res = await api.get("/Product/All");
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("something went wrong!");
    } 
  }
);
export const SearchFilter = createAsyncThunk(
  "productSlice/filteredProducts",
  async (term)=>{
    try{
      const res = await api.get(`/Product/Search/${term}`);
      return res.data;
    }
    catch(error){
      console.log("Something went wrong")
    }
   
  }
);

export const Categorize = createAsyncThunk(
  "ProductSlice/Categorize",
  async({cat})=>{
    const res = await axios.get(`https://localhost:7211/api/Product/${cat}`);

    // console.log(`this is from category thunk${cat}`)
    console.log(res.data.data)
    return res.data
   
  }
)
export const Addproduct= createAsyncThunk(
  "ProductSlice/Addproduct",
  async(formData,{dispatch})=>{
    console.log("this is from thunk",formData);
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    try{
      const resp = await axios.post("https://localhost:7211/api/Product/AddProduct",formData,{
        headers:{
          "Content-Type": "multipart/form-data",
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      if(resp.status==200){
        toast.success("Product added successfully!");
        dispatch(fetchProducts())
      }

    }catch(error){
      if(error.response.status==400){
        toast.error("product already exist")
      }
      toast.error("error occured during adding")
      console.log("eroor ocured during adding")
    }
    
  }
)


export const updateProduct = createAsyncThunk(
  "ProductSlice/updateProduct",
  async ({ values, idNum }, { dispatch }) => {
    const formData = new FormData();
    
    // Ensure CategoryId is handled correctly
    for (const key in values) {
      console.log(key);
      if (key === "CategoryId" && values[key]) {
        // Ensure CategoryId is a valid number
        
        
        formData.append(key, parseInt(values[key], 10));
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      const res = await axios.put(
        `https://localhost:7211/api/Product/UpdateProduct/${idNum}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Product updated successfully");
        return res.data; 
      }
    } catch (error) {
      console.error("Error occurred while updating:", error);
      toast.error("Something went wrong while updating the product.");
      throw error;
    }
  }
);

export const DeleteProduct = createAsyncThunk(
  "ProductSlice/DeleteProduct",
  async({product},{dispatch})=>{
    try{
      const resp= await axios.delete(`https://localhost:7211/api/Product/Delete/${product.id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      if(resp.status==200){
        toast.success(`${product.title} removed`)
        dispatch(fetchProducts())
      }

    }catch(error){
      toast.error("something went wrong")

    }
  }
)

const initialState = {
  products: [],
  filteredProducts: [],
  category: "all",
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    // searchFilter: (state, action) => {
    //   state.filteredProducts.data = state.products.data.filter((product) =>
    //     product.title.toLowerCase().includes(action.payload.toLowerCase())
    //   );
    // },
    // categorize: (state, action) => {
    //   if (action.payload === "all") {
    //     state.filteredProducts.data = state.products.data;
    //   } 
    //   // console.log(action.payload);
    // },
    // addProduct: (state, action) => {
    //   state.products.data.push(action.payload);
    //   state.filteredProducts.data.push(action.payload);
    // },
    deleteProduct: (state, action) => {
      const productId = action.payload._id;
      const products = state.products.data.filter(
        (product) => product._id !== productId
      );
      state.products.data = products;

      const filteredProducts = state.filteredProducts.data.filter(
        (product) => product._id !== productId
      );
      state.filteredProducts.data = filteredProducts;
    },
    // updateProduct: (state, action) => {
    //   const updatedProduct = action.payload;
    //   state.products.data = state.products.data.map((product) =>
    //     product._id === updatedProduct._id ? updatedProduct : product
    //   );
    //   state.filteredProducts.data = state.filteredProducts.data.map((product) =>
    //     product._id === updatedProduct._id ? updatedProduct : product
    //   );
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      // console.log("loading");
    }), 
      builder.addCase(fetchProducts.rejected, (state, action) => {
        console.log("Error in fetching");
      }),
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        // console.log("Succes");
        state.products = action.payload;
        state.filteredProducts = action.payload;
        // console.log(action.payload.data);
      })
      builder.addCase(SearchFilter.pending,(state,action)=>{
        console.log("Loading")
      })
      builder.addCase(SearchFilter.rejected,(state,action)=>{
        console.log("Error in fetching search name")
      })
      builder.addCase(SearchFilter.fulfilled,(state,action)=>{
        state.filteredProducts = action.payload
      })
      builder.addCase(Categorize.pending,(state,action)=>{
        console.log("loading")
      })
      builder.addCase(Categorize.rejected,(state,action)=>{
        state.filteredProducts  = action.payload
      })
      builder.addCase(Categorize.fulfilled,(state,action)=>{
        state.filteredProducts = action.payload
      })
  },
});

export default productSlice.reducer;
export const {
  
  
  deleteProduct,
  // addProduct,
  // updateProduct,
} = productSlice.actions;
