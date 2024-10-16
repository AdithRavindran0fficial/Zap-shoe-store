import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const FetchingOrder = createAsyncThunk(
    "OrderSlice/FetchingOrder",
    async(_,{rejectWithValue})=>{
        try{

            const response = await axios.get("https://localhost:7211/api/Order/getOrder",{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(response.status==200){
                return response.data.data
            }

        }
        catch(error){
            rejectWithValue(error)

        }
        
    }
)
export const GetOrderdetails = createAsyncThunk(
    "OrderSlice/GetOrderdetails",
    async(_)=>{
        try{
            const res = await axios.get("https://localhost:7211/api/Order/getOrder",{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(res.status==200){
                return res.data.data
            }

        }
        catch(error){
            console.log("Eror occured during fetching orders")
        }
    }
)




const initialState = {
    Orders:[],
    AllOrders:[],
    error:null,
    totalRevenue:0,
    TotalSales:0
}

export const  PlaceOrder = createAsyncThunk(
    "OrderSlice/PlaceOrder",
    async (details,toast)=>{
        try{
            const response = await axios.post("https://localhost:7211/api/Order",details,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(response.status==200){
                toast.Success("Order placed")
                        
            }
        }
        catch(error){
            toast.error("Something went wrong")
        }

        }
       
)
export const TotalRevenueFetch = createAsyncThunk(
    "OrderSlice/TotalRevenueFetch",
    async()=>{
        try{
            const resp = await axios.get("https://localhost:7211/api/Order/TotalRev",{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(resp.status==200){
                console.log(resp.data.data)
                return resp.data.data
            }
        }
        catch(error){
            console.log(error)
        }
    }
)
export const TotalSalesFetch = createAsyncThunk(
    "OrderSlice/TotalSalesFetch",
    async()=>{
        try{
            const resp = await axios.get("https://localhost:7211/api/Order/TotalSales",{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(resp.status==200){
                console.log(resp.data.data)
                return resp.data.data
            }
        }
        catch(error){
            console.log(error)
        }
    }
)




const OrderSlice = createSlice({
    name:"OrderSlice",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(FetchingOrder.fulfilled,(state,action)=>{
            state.Orders = action.payload
        })
        .addCase(FetchingOrder.rejected,(state,action)=>{
            state.error = action.payload
        })
        .addCase(TotalRevenueFetch.fulfilled,(state,action)=>{
            state.totalRevenue = action.payload
        })
        .addCase(TotalSalesFetch.fulfilled,(state,action)=>{
            state.TotalSales = action.payload
        })
        .addCase(GetOrderdetails.fulfilled,(state,action)=>{
            state.Orders  = action.payload
        })
    }

})
export default OrderSlice.reducer