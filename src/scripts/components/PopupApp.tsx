import React, { Suspense, useEffect, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useSWR from 'swr';
import { NotificationList } from '~/components/NotificationList';
import { PopupLoading } from '~/components/PopupLoading';
import { PopupHeader } from '~/components/PopupHeader';
import { PopupError } from '~/components/PopupError';
import { getSpacesFromStorage } from '~/utils/webextension';

export const PopupView: React.VFC = () => {
  const { data: [space] = [] } = useSWR(
    'webextension.storage.spaces',
    () => getSpacesFromStorage(),
    { suspense: true }
  );

  const isSpaceInvalid = useMemo(
    () => !space || !space.domain || !space.apiKey,
    [space]
  );

  useEffect(() => {
    if (isSpaceInvalid) {
      throw new Error(
        'スペースドメイン / APIキーを設定画面から登録してください。'
      );
    }
  }, [isSpaceInvalid]);

  return isSpaceInvalid ? null : <NotificationList space={space} />;
};

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-full mx-auto">
      <div className="max-w-full w-[480px]">
        <ErrorBoundary FallbackComponent={PopupError}>
          <PopupHeader />
          <Suspense fallback={<PopupLoading />}>
            <PopupView />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
