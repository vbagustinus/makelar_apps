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
  newsPropertyTips: null,
  loadingNewsPropertyTips: false,
  errorNewsPropertyTips: null,
  newsMarketTrends: null,
  loadingNewsMarketTrends: false,
  errorNewsMarketTrends: null,

  // Actions
  getNews: async () => {
    console.log('Fetching news...');
    set({ loadingNews: true, errorNews: null });
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=tips+beli+rumah&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      set({ news: data.items || [] });
    } catch (error) {
      set({ errorNews: error.message || 'Something went wrong' });
    } finally {
      set({ loadingNews: false });
    }
  },
  getNewsPropertyTips: async () => {
    console.log('Fetching property tips...');
    set({ loadingNewsPropertyTips: true, errorNewsPropertyTips: null });
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=investasi+properti+indonesia&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      set({ newsPropertyTips: data.items || [] });
    } catch (error) {
      set({ errorNewsPropertyTips: error.message || 'Something went wrong' });
    } finally {
      set({ loadingNewsPropertyTips: false });
    }
  },
  getNewsMarketTrends: async () => {
    console.log('Fetching market trends...');
    set({ loadingNewsMarketTrends: true, errorNewsMarketTrends: null });
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=berita+properti+terkini&type=video&publishedAfter=${lastWeekUTC}&regionCode=ID&order=date&videoDuration=medium&key=${YOUTUBE_API_KEY}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      set({ newsMarketTrends: data.items || [] });
    } catch (error) {
      set({ errorNewsMarketTrends: error.message || 'Something went wrong' });
    } finally {
      set({ loadingNewsMarketTrends: false });
    }
  },
}));

export default useNewsStore;
