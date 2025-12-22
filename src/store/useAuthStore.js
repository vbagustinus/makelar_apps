import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { logEvent } from '@react-native-firebase/analytics';
import { getString, removeItem, setItem } from '../helpers';
import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import { Platform, Alert } from 'react-native';
// import crashlytics from '@react-native-firebase/crashlytics';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  userLoading: false,
  userError: null,
  token: getString('token') || null,
  listUser: [],

  // Actions
  setToken: async token => {
    try {
      setItem('token', token);
      set({ token });
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  clearToken: async () => {
    console.log('Clearing token...');

    try {
      removeItem('token');
      removeItem('user');
      set({ token: null, user: null });
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  },

  fetchTopUsersByPoint: async (limit = 10) => {
    console.log('CALL fetchTopUsersByPoint');

    try {
      const snapshot = await firestore()
        .collection('users')
        .orderBy('point', 'desc') // urutkan dari terbesar
        .limit(limit) // ambil cuma 10 data
        .get();

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('🏆 Top users:', users);
      set({ listUser: users });
      return users;
    } catch (error) {
      console.error('❌ Error ambil top users:', error);
      throw error;
    }
  },

  fetchUserData: async uid => {
    try {
      set({ userLoading: true });
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (userDoc.exists) {
        const data = userDoc.data();
        await get().setUser(data);
        return data;
      } else {
        throw new Error('User not found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ userError: error.message });
      throw error;
    } finally {
      set({ userLoading: false });
    }
  },

  saveUserData: async (uid, userData) => {
    console.log('User data to save:', userData);
    console.log('User ID:', uid);

    try {
      set({ userLoading: true });
      await firestore().collection('users').doc(uid).set(userData);
      console.log('User data saved successfully');
      await get().setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      set({ userError: error.message });
      throw error;
    } finally {
      set({ userLoading: false });
    }
  },

  updateUserDataWithPhoto: async (uid, updates) => {
    set({ userLoading: true, userError: null });

    try {
      let photoURL = updates.photoURL || null;

      // kalau photoURL itu file lokal (bukan link http), upload ke storage
      if (photoURL && !photoURL.startsWith('http')) {
        const cleanedPath =
          Platform.OS === 'android'
            ? photoURL.replace('file://', '')
            : photoURL;

        const compressedImage = await ImageResizer.createResizedImage(
          cleanedPath,
          800,
          800,
          'JPEG',
          80,
          0,
        );

        // hapus foto lama kalau ada
        if (get().user?.photoURL) {
          try {
            const oldFilePath = get()
              .user.photoURL.split('/o/')[1]
              .split('?')[0]
              .replace(/%2F/g, '/');
            await storage().ref(oldFilePath).delete();
          } catch (e) {
            console.log('No old photo found, skip delete.');
          }
        }

        const fileName = `${uid}_${Date.now()}.jpg`;
        const storagePath = `users/${uid}/${fileName}`;
        const reference = storage().ref(storagePath);

        await reference.putFile(compressedImage.uri.replace('file://', ''));
        photoURL = await reference.getDownloadURL();
      }

      const updateData = {
        ...updates,
        photoURL,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('users').doc(uid).update(updateData);

      // update store state
      const currentUser = get().user || {};
      const updatedUser = { ...currentUser, ...updateData };
      await get().setUser(updatedUser);

      Alert.alert('Success', 'Pembaruan data berhasil');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user data:', error);
      set({ userError: error.message });
      throw error;
    } finally {
      set({ userLoading: false });
    }
  },

  updateUserPoint: async (uid, point) => {
    set({ userLoading: true, userError: null });

    try {
      const userRef = firestore().collection('users').doc(uid);
      const doc = await userRef.get();

      if (!doc.exists || doc.data().point === undefined) {
        // 📌 Kalau user belum punya point, set dengan nilai awal
        const updateData = {
          point,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };
        await userRef.update(updateData);

        const currentUser = get().user || {};
        const updatedUser = { ...currentUser, ...updateData };
        await get().setUser(updatedUser);

        console.log('✅ Point initialized:', point);
        return updatedUser;
      } else {
        // 📌 Kalau sudah ada point, lakukan increment
        await userRef.update({
          point: firestore.FieldValue.increment(point),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        const currentUser = get().user || {};
        const updatedUser = {
          ...currentUser,
          point: (currentUser.point || 0) + point,
          updatedAt: new Date(),
        };
        await get().setUser(updatedUser);

        console.log('✅ Point incremented by:', point);
        return updatedUser;
      }
    } catch (error) {
      console.error('❌ Error updating point:', error);
      set({ userError: error.message });
      throw error;
    } finally {
      set({ userLoading: false });
    }
  },

  setUser: async user => {
    try {
      console.log('User set:', user);
      await get().setToken(user?.uid);
      setItem('user', JSON.stringify(user));
      set({ user, token: user?.uid, userLoading: false });

      await logEvent('user', {
        id: user?.uid,
        ...user,
      });

      // crashlytics().log('User signed in.');
      // crashlytics().setUserId(user.uid);
      // crashlytics().setAttributes({
      //   email: user?.email || 'N/A',
      //   displayName: user?.displayName || 'N/A',
      // });
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },
}));

export default useAuthStore;
