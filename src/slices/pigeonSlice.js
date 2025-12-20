import { createSlice } from '@reduxjs/toolkit';

export const pigeonSlice = createSlice({
  name: 'pigeon',
  initialState: {
    pigeonsList: [],
  },
  reducers: {
    setPigeonList: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.pigeonsList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPigeonList } = pigeonSlice.actions;

export default pigeonSlice.reducer;
