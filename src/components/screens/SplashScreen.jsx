import React, { useEffect, useRef } from 'react';

/**
 * Splash screen with brand video
 */
export const SplashScreen = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
