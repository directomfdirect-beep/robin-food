import React from 'react';

/**
 * DS v3 Skeleton Loader
 * Shimmer gradient animation placeholder
 */
export const Skeleton = ({ className = '', rounded = 'ds-s' }) => (
  <div className={`skeleton rounded-${rounded} ${className}`} />
);

/**
 * Product Card Skeleton
 */
export const ProductCardSkeleton = ({ className = '' }) => (
  <div className={`bg-base-card rounded-ds-m shadow-elevation-1 overflow-hidden ${className}`}>
    <Skeleton className="aspect-[4/3] w-full" rounded="none" />
    <div className="p-ds-s space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-3 w-2/5" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

/**
 * Store Card Skeleton
 */
export const StoreCardSkeleton = ({ className = '' }) => (
  <div className={`bg-base-card rounded-ds-m shadow-elevation-1 p-ds-m ${className}`}>
    <div className="flex gap-3 items-center">
      <Skeleton className="w-10 h-10 flex-shrink-0" rounded="ds-s" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  </div>
);
