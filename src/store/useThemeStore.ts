import { create } from 'zustand';
import { getString, setItem } from '../helpers';

const getInitialTheme = () => {
  const savedTheme = getString('theme');
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const useThemeStore = create(set => ({
  theme: getInitialTheme(),
  setTheme: theme => {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    setItem('theme', normalized);
    set({ theme: normalized });
  },
  toggleTheme: () =>
    set(state => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      setItem('theme', next);
      return { theme: next };
    }),
}));

export default useThemeStore;
