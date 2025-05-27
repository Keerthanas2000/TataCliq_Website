import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      console.log("User Reducer - Setting user:", action.payload);
      state.user = action.payload;
    },
    clearUser: (state) => {
      console.log("User Reducer - Clearing user");
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;