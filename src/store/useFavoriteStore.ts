import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const normalizeFavorite = item => {
  if (!item) return null;
  const id = item.id || item.propertyId;
  if (!id) return null;
  return {
    id,
    propertyName: item.propertyName || item.title || 'Properti',
    price: item.price || null,
    address: item.address || item.location || item.city || '',
    imageUrl: item.imageUrl || item.imageUrls?.[0] || item.image || null,
    propertyTypeName:
      item.propertyTypeName || item.propertyType?.name || item.tag || '',
    uid: item.uid || null,
  };
};

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoritesLoading: false,
  favoritesError: null,
  loadFavorites: async () => {
    const user = auth().currentUser;
    if (!user) {
      set({ favorites: [], favoritesLoading: false, favoritesError: null });
      return;
    }
    set({ favoritesLoading: true, favoritesError: null });
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .orderBy('createdAt', 'desc')
        .get();
      const favorites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ favorites });
    } catch (error) {
      set({ favoritesError: error.message });
    } finally {
      set({ favoritesLoading: false });
    }
  },
  isFavorite: id => {
    if (!id) return false;
    return get().favorites.some(item => item.id === id);
  },
  addFavorite: async item => {
    const normalized = normalizeFavorite(item);
    if (!normalized) return;
    const user = auth().currentUser;
    if (!user) return;
    const { favorites } = get();
    if (favorites.some(fav => fav.id === normalized.id)) return;
    const next = [normalized, ...favorites];
    set({ favorites: next });
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .doc(normalized.id)
        .set({
          ...normalized,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      set({ favorites, favoritesError: error.message });
    }
  },
  removeFavorite: async id => {
    if (!id) return;
    const user = auth().currentUser;
    if (!user) return;
    const prev = get().favorites;
    const next = prev.filter(item => item.id !== id);
    set({ favorites: next });
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .doc(id)
        .delete();
    } catch (error) {
      set({ favorites: prev, favoritesError: error.message });
    }
  },
  toggleFavorite: async item => {
    const normalized = normalizeFavorite(item);
    if (!normalized) return;
    const user = auth().currentUser;
    if (!user) return;
    const { favorites } = get();
    const exists = favorites.some(fav => fav.id === normalized.id);
    const next = exists
      ? favorites.filter(fav => fav.id !== normalized.id)
      : [normalized, ...favorites];
    set({ favorites: next });
    const ref = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('favorites')
      .doc(normalized.id);
    try {
      if (exists) {
        await ref.delete();
      } else {
        await ref.set({
          ...normalized,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      set({ favorites, favoritesError: error.message });
    }
  },
  clearFavorites: () => {
    set({ favorites: [] });
  },
}));

export default useFavoriteStore;
