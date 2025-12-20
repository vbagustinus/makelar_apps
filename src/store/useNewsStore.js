import { create } from 'zustand';
import { Keys } from '../constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const YOUTUBE_API_KEY = Keys.API_YOUTUBE;
const lastWeekUTC = dayjs().subtract(7, 'day').utc().format();

const useNewsStore = create(set => ({
  // State
  news: null,
  loadingNews: false,
  errorNews: null,
  newsPigeonRace: null,
  loadingNewsPigeonRace: false,
  errorNewsPigeonRace: null,
  newsPigeonPost: null,
  loadingNewsPigeonPost: false,
  errorNewsPigeonPost: null,

  // Actions
  getNews: async () => {
    console.log('Fetching news...');

    // Set loading to true and clear previous errors
    set({ loadingNews: true, errorNews: null });

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=merpati+kolong&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.items);

      // Update state with fetched news
      set({ news: data.items || [] });
    } catch (error) {
      console.error('Error fetching YouTube data:', error);

      // Set error state
      set({
        errorNews: error.message || 'Something went wrong',
      });
    } finally {
      // Set loading to false after fetching is complete
      set({ loadingNews: false });
    }
  },
  getNewsPigeonRace: async () => {
    console.log('Fetching news...');

    // Set loading to true and clear previous errors
    set({ loadingNewsPigeonRace: true, errorNewsPigeonRace: null });

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=merpati+balap&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.items);

      // Update state with fetched newsPigeonRace
      set({ newsPigeonRace: data.items || [] });
    } catch (error) {
      console.error('Error fetching YouTube data:', error);

      // Set error state
      set({
        errorNewsPigeonRace: error.message || 'Something went wrong',
      });
    } finally {
      // Set loading to false after fetching is complete
      set({ loadingNewsPigeonRace: false });
    }
  },
  getNewsPigeonPost: async () => {
    console.log('Fetching news...');

    // Set loading to true and clear previous errors
    set({ loadingNewsPigeonPost: true, errorNewsPigeonPost: null });

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=merpati+pos&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.items);

      // Update state with fetched newsPigeonPost
      set({ newsPigeonPost: data.items || [] });
    } catch (error) {
      console.error('Error fetching YouTube data:', error);

      // Set error state
      set({
        errorNewsPigeonPost: error.message || 'Something went wrong',
      });
    } finally {
      // Set loading to false after fetching is complete
      set({ loadingNewsPigeonPost: false });
    }
  },
}));

export default useNewsStore;
