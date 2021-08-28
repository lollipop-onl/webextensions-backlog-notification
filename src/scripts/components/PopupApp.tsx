import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useSWR from 'swr';
import { NotificationList } from '~/components/NotificationList';
import { ProjectList } from '~/components/ProjectList';
import { PopupLoading } from '~/components/PopupLoading';
import { PopupHeader } from '~/components/PopupHeader';
import { PopupError } from '~/components/PopupError';
import { getSpacesFromStorage } from '~/utils/webextension';

export const PopupView: React.VFC = () => {
  const [tabIndex, setTabIndex] = useState(0);
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

  if (isSpaceInvalid) {
    return null;
  }

  return (
    <div>
      <PopupHeader tabIndex={tabIndex} onChange={setTabIndex} />
      {tabIndex === 1 ? (
        <ProjectList space={space} />
      ) : (
        <NotificationList space={space} />
      )}
    </div>
  );
};

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-full mx-auto">
      <div className="max-w-full w-[480px]">
        <ErrorBoundary FallbackComponent={PopupError}>
          <Suspense fallback={<PopupLoading />}>
            <PopupView />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
