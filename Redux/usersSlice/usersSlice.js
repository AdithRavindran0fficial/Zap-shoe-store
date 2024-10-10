import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";

export const fetchUsers = createAsyncThunk("userslice/fetchUsers", async () => {
  try {
    const res = await api.get("/admin/userlist");
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("something went wrong!");
  }
});

const initialState = {
  users: [],
  filteredUsers: [],
};

const userSlice = createSlice({
  name: "userslice",
  initialState,
  reducers: {
    searchFilterUser: (state, action) => {
      state.filteredUsers.data = state.users.data.filter((user) =>
        user.username.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    deleteUser: (state, action) => {
      const userId = action.payload.id;
      state.users.data = state.users.data.filter((user) => user.id !== userId);
      state.filteredUsers.data = state.filteredUsers.data.filter((user) => user.id !== userId);
    },
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
export const { searchFilterUser, deleteUser } = userSlice.actions;
