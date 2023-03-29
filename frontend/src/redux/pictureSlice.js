import { createSlice } from "@reduxjs/toolkit";

/**
 * The Redux slice responsible for picture data (the picture to be uploaded).
 * *
 */
export const pictureSlice = createSlice({
  name: "picture",
  initialState: {
    pictureToUpload: null,
  },
  reducers: {
    setPictureToUpload: function (state, action) {
      state.pictureToUpload = action.payload;
    },
    clearPictureToUpload: function (state, action) {
      state.pictureToUpload = null;
    },
  },
});

export const { setPictureToUpload, clearPictureToUpload } =
  pictureSlice.actions;
export default pictureSlice.reducer;
