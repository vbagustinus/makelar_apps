import { useState } from 'react';
import dayjs from 'dayjs';

const useShareLimiter = () => {
  const [shareHistory, setShareHistory] = useState([]);

  const canAddPoint = () => {
    const now = dayjs();
    const recent = shareHistory.filter(t => now.diff(dayjs(t), 'second') < 60);
    return recent.length < 5;
  };

  const addShare = () => {
    setShareHistory(prev => [...prev, new Date()]);
  };

  return { canAddPoint, addShare };
};

export default useShareLimiter;
