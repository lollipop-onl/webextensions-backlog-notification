import React from 'react';
import { NotificationSkeleton } from '~/components/NotificationSkeleton';

export const PopupLoading: React.VFC = () => (
  <div>
    {Array.from({ length: 6 })
      .fill(null)
      .map((_, index) => (
        <div key={index} className="border-b border-gray-400 last:border-none">
          <NotificationSkeleton />
        </div>
      ))}
  </div>
);
