import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "axios";
import toast from "react-hot-toast";

export const fetchUsers = createAsyncThunk("userslice/fetchUsers", async () => {
  try {
    const res = await axios.get("https://localhost:7211/api/User/All",{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    });
    console.log(res.data);
    return res.data.data;
  } catch (error) {
    console.log("something went wrong!");
  }
});

export const DeleteUser = createAsyncThunk(
  "userSlice/DeleteUser",
  async ({users},{dispatch})=>{
    try{
      const resp = await axios.delete(`https://localhost:7211/api/User/Delete${users.id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      if(resp.status==200){
        toast.success("deleted")
        dispatch(fetchUsers())
      }

    }catch(error){
      toast.error("Something went wrong")
    }
    
  }
)

const initialState = {
  users: [],
  filteredUsers: [],
};

const userSlice = createSlice({
  name: "userslice",
  initialState,
  reducers: {
    // searchFilterUser: (state, action) => {
    //   state.filteredUsers.data = state.users.data.filter((user) =>
    //     user.username.toLowerCase().includes(action.payload.toLowerCase())
    //   );
    // },
    // deleteUser: (state, action) => {
    //   const userId = action.payload.id;
    //   state.users.data = state.users.data.filter((user) => user.id !== userId);
    //   state.filteredUsers.data = state.filteredUsers.data.filter((user) => user.id !== userId);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      console.log("loading");
    }),
      builder.addCase(fetchUsers.rejected, (state, action) => {
        console.log("Error in fetching");
      }),
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
        // console.log("Succes");
        state.users = action.payload;
        state.filteredUsers = action.payload;
        // console.log(action.payload);
      });
  },
});

export default userSlice.reducer;
export const { searchFilterUser } = userSlice.actions;
