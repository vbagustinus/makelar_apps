declare module '@supabase/supabase-js' {
  export const createClient: (...args: any[]) => any;
}

declare module 'axios' {
  const axios: any;
  export default axios;
}

declare module '@reduxjs/toolkit' {
  export const createSlice: any;
}

declare module 'zustand' {
  export const create: any;
}

declare module '@react-native-firebase/auth' {
  const auth: any;
  export default auth;
}

declare module '@react-native-firebase/firestore' {
  const firestore: any;
  export default firestore;
}

declare module '@react-native-firebase/storage' {
  export const listAll: any;
  const storage: any;
  export default storage;
}

declare module '@react-native-firebase/analytics' {
  const analytics: any;
  export default analytics;
}

declare module '@react-native-firebase/remote-config' {
  const remoteConfig: any;
  export default remoteConfig;
}

declare module '@react-native-firebase/app' {
  const app: any;
  export default app;
}
