import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

type PictureStore = {
  pictureToUpload: string | null;
};

/**
 * The Redux slice responsible for picture data (the picture to be uploaded).
 * *
 */
export const pictureSlice = createSlice<
  PictureStore,
  SliceCaseReducers<PictureStore>,
  string
>({
  name: "picture",
  initialState: {
    pictureToUpload: null,
  },
  reducers: {
    setPictureToUpload: function (state, action: { payload: string }) {
      state.pictureToUpload = action.payload;
    },
    clearPictureToUpload: function (state) {
      state.pictureToUpload = null;
    },
  },
});

export const { setPictureToUpload, clearPictureToUpload } =
  pictureSlice.actions;
export default pictureSlice.reducer;
