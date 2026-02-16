import React from 'react';
import { Leaf, Cloud, Wallet, Share2 } from 'lucide-react';

/**
 * DS v3 Sustainability Widget — Compact variant (profile)
 * H=~120px, eco-accent gradient bg, progress bar
 */
export const SustainabilityWidget = ({
  savedFoodKg = 0,
  co2Saved = 0,
  moneySaved = 0,
  ecoRank = '',
  progress = 0,
  onShare,
  variant = 'compact',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-vibrant-eco-start to-vibrant-eco-end rounded-ds-l p-ds-l text-white ${className}`}>
        {/* Stats row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-white" />
            <span className="ds-heading-s text-white">{savedFoodKg} кг</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud size={20} className="text-white/80" />
            <span className="ds-body-s text-white/90">{co2Saved} кг CO₂</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-white/80" />
            <span className="ds-body-s text-white/90">{moneySaved} ₽</span>
          </div>
        </div>

        {/* Progress bar */}
        {ecoRank && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="ds-body-xs text-white/80">До «{ecoRank}»</span>
              <span className="ds-body-xs text-white/80">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Share CTA */}
        {onShare && (
          <button
            onClick={onShare}
            className="w-full h-8 rounded-ds-s border border-white/40 text-white ds-label-button-s flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
          >
            <Share2 size={14} />
            Поделиться
          </button>
        )}
      </div>
    );
  }

  // Celebration variant (fullscreen, post-order) — simplified for now
  return (
    <div className={`bg-gradient-to-br from-vibrant-celebration-start to-vibrant-celebration-end rounded-ds-xl p-ds-2xl text-white text-center ${className}`}>
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="ds-display-hero text-white mb-2">Вы спасли {savedFoodKg} продуктов!</h2>
      <p className="ds-body-l text-white/90 mb-1">Экономия: {moneySaved} ₽</p>
      <p className="ds-body-l text-white/90 mb-6">CO₂: {co2Saved} кг</p>
      {onShare && (
        <button
          onClick={onShare}
          className="h-12 px-6 rounded-ds-m bg-white/20 backdrop-blur text-white ds-label-button hover:bg-white/30 transition-colors"
        >
          Поделиться
        </button>
      )}
    </div>
  );
};
