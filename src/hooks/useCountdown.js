import { useState, useEffect, useRef } from 'react';

const calcRemaining = (expiresAt) => {
  if (!expiresAt) return null;
  const diff = expiresAt - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, isUrgent: true, expired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isUrgent: diff < 30 * 60 * 1000,
    expired: false,
  };
};

/**
 * Countdown hook — counts down to expiresAt timestamp
 * Returns { hours, minutes, seconds, isUrgent, expired }
 * isUrgent = true when < 30 minutes remain
 */
export const useCountdown = (expiresAt) => {
  const [remaining, setRemaining] = useState(() => calcRemaining(expiresAt));
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!expiresAt) return;
    setRemaining(calcRemaining(expiresAt));
    intervalRef.current = setInterval(() => {
      const r = calcRemaining(expiresAt);
      setRemaining(r);
      if (r?.expired) clearInterval(intervalRef.current);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [expiresAt]);

  return remaining;
};
