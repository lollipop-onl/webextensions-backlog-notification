import React from 'react';
import { range } from 'lodash-es';
import { NotificationSkeleton } from '~/components/NotificationSkeleton';

export const NotificationListLoading: React.VFC = () => (
  <div>
    {range(6).map((index) => (
      <div key={index} className="border-b border-gray-400 last:border-none">
        <NotificationSkeleton />
      </div>
    ))}
  </div>
);
