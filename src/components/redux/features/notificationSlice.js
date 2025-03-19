import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    unread: [],
  },
  reducers: {
    setUnreadNotifications: (state, action) => {
      state.unread = action.payload;
    },
    markAsRead: (state, action) => {
      state.unread = state.unread.filter((notif) => notif.id !== action.payload);
    },
  },
});

export const { setUnreadNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;