import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ONBOARDING_DATA } from '@/data/constants';
import { Button } from '@/components/ui/Button';

/**
 * Onboarding slides screen
 */
export const OnboardingScreen = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_DATA.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = ONBOARDING_DATA[currentSlide];
  const isLastSlide = currentSlide === ONBOARDING_DATA.length - 1;

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden z-[4000] animate-slide-in-bottom">
      {/* Image section */}
      <div className="relative h-[65%] w-full">
        <img
          src={slide.image}
          alt="onboarding"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        
        {/* Skip button - hide on last slide */}
        {!isLastSlide && (
          <button
            onClick={onSkip}
            className="absolute top-12 right-6 bg-black/40 backdrop-blur-md text-white px-5 py-2 rounded-full font-black text-[10px] uppercase"
          >
            Пропустить
          </button>
        )}
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-10 py-8 flex flex-col justify-between relative z-10 -mt-16 rounded-t-[50px] shadow-2xl">
        <div className="space-y-4">
          <h2 className="text-[32px] font-black uppercase italic leading-tight">
            {slide.title}
          </h2>
          <p className="text-gray-400 text-base leading-snug">
            {slide.description}
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center pb-8">
          {/* Dots indicator */}
          <div className="flex gap-2">
            {ONBOARDING_DATA.map((_, index) => (
              <div
                key={index}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${currentSlide === index ? 'w-8 bg-acid' : 'w-2 bg-gray-100'}
                `}
              />
            ))}
          </div>

          {/* Next button */}
          <Button onClick={handleNext} fullWidth size="lg">
            {isLastSlide ? (
              'Начать покупки'
            ) : (
              <>Далее <ChevronRight size={20} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
