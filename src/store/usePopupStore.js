// popupStore.js
import { create } from 'zustand';

export const usePopupStore = create(set => ({
  popup: null,
  showPopup: popup => set({ popup }),
  hidePopup: () => set({ popup: null }),
}));
