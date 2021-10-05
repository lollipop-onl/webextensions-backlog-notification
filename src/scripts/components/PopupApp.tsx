import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useSWR from 'swr';
import { NotificationList } from '~/components/NotificationList';
import { ProjectList } from '~/components/ProjectList';
import { IssueList } from '~/components/IssueList';
import { NotificationListLoading } from '~/components/NotificationListLoading';
import { ProjectListLoading } from '~/components/ProjectListLoading';
import { IssueListLoading } from '~/components/IssueListLoading';
import { PopupHeader } from '~/components/PopupHeader';
import { PopupError } from '~/components/PopupError';
import { getActiveTabIndexFromStorage, getSpacesFromStorage, setActiveTabIndexToStorage } from '~/utils/webextension';

export const PopupView: React.VFC = () => {
  const [tabIndex, setTabIndex] = useState<number | null>(null);
  const { data: [space] = [] } = useSWR(
    'webextension.storage.spaces',
    () => getSpacesFromStorage(),
    { suspense: true }
  );

  const isSpaceInvalid = useMemo(
    () => !space || !space.domain || !space.apiKey,
    [space]
  );

  const onChangeActiveTab = useCallback(async (tabIndex: number) => {
    setTabIndex(tabIndex);

    await setActiveTabIndexToStorage(tabIndex);
  }, [])

  useEffect(() => {
    getActiveTabIndexFromStorage().then((tabIndex) => setTabIndex(tabIndex));
  }, []);

  useEffect(() => {
    if (isSpaceInvalid) {
      throw new Error(
        'スペースドメイン / APIキーを設定画面から登録してください。'
      );
    }
  }, [isSpaceInvalid]);

  if (isSpaceInvalid || tabIndex == null) {
    return null;
  }

  return (
    <div>
      <PopupHeader tabIndex={tabIndex} onChange={onChangeActiveTab} />
      { tabIndex === 0 ? (
        <Suspense fallback={<NotificationListLoading />}>
          <NotificationList space={space} />
        </Suspense>
      ) : tabIndex === 1 ? (
        <Suspense fallback={<ProjectListLoading />}>
          <ProjectList space={space} />
        </Suspense>
      ) : tabIndex === 2 ? (
        <Suspense fallback={<IssueListLoading />}>
          <IssueList space={space} />
        </Suspense>
      ) : null}
    </div>
  );
};

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-full mx-auto">
      <div className="max-w-full w-[480px]">
        <ErrorBoundary FallbackComponent={PopupError}>
          <Suspense fallback={<p>loading...</p>}>
            <PopupView />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
