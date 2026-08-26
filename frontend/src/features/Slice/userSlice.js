import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    userRole: "",
    isLoggedIn: false,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserRole: (state, action) => {
            state.userRole = action.payload;
            state.isLoggedIn = true;
        },
        clearUserRole: (state) => {
            state.userRole = "";
            state.isLoggedIn = false;
        },
    },
});

export const { setUserRole, clearUserRole } = userSlice.actions;
export default userSlice.reducer;