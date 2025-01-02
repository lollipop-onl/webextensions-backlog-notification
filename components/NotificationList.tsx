import React, { useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import http from 'ky-universal';
import InfiniteScroll from 'react-infinite-scroller';
import { NotificationItem } from '~/components/NotificationItem';
import { NotificationSkeleton } from '~/components/NotificationSkeleton';
import { BacklogAPIEndpoints } from '~/api/types';
import { SpaceOptions } from '~/types/app';

type Props = {
  space?: SpaceOptions;
};

type BacklogNotifications =
  BacklogAPIEndpoints['get']['/api/v2/notifications']['response'];

const LOAD_PER_PAGE = 30;

export const NotificationList: React.VFC<Props> = ({ space }) => {
  // SWR のキーを取得する
  const getKey = (
    pageIndex: number,
    previousPageData: BacklogNotifications | null
  ) => {
    if (!space || previousPageData?.length === 0) {
      return null;
    }

    const lastNotification = previousPageData?.slice().pop();

    const searchParams = new URLSearchParams();

    searchParams.set('count', `${LOAD_PER_PAGE}`);
    searchParams.set('apiKey', space.apiKey);

    if (lastNotification) {
      searchParams.set('maxId', lastNotification.id.toString());
    }

    return `https://${
      space.domain
    }/api/v2/notifications?${searchParams}`;
  };
  // SWR の Fetcher
  const fetcher = (url: string) => http(url).then((res) => res.json());

  const {
    data: notificationPages = [],
    size,
    setSize,
  } = useSWRInfinite<BacklogNotifications>(getKey, fetcher, { suspense: true, revalidateOnMount: false });

  // お知らせの追加ロード中か
  const isLoadingMore = useMemo(
    () => size > 0 && typeof notificationPages[size - 1] === 'undefined',
    [size, notificationPages]
  );
  // お知らせが０件か
  const isEmpty = useMemo(
    () => notificationPages[0] && notificationPages[0].length === 0,
    [notificationPages]
  );
  // 無限ロードが終了したか
  const isReachingEnd = useMemo(
    () =>
      isEmpty ||
      notificationPages[notificationPages.length - 1]?.length < LOAD_PER_PAGE,
    [isEmpty, notificationPages]
  );

  // お知らせを追加で読み込む
  const loadMore = useCallback(async () => {
    if (isLoadingMore || isReachingEnd) {
      return;
    }

    return await setSize(size + 1);
  }, [isLoadingMore, isReachingEnd, size, setSize]);

  return (
    <InfiniteScroll
      loadMore={loadMore}
      hasMore={!isReachingEnd}
      loader={
        <div className="border-t border-gray-400">
          <NotificationSkeleton key={0} />
        </div>
      }
    >
      <ul>
        {notificationPages.flatMap((notifications) =>
          notifications.map((notification, index) => (
            <li
              key={notification.id}
              className="border-b border-gray-400 last:border-none"
            >
              <NotificationItem notification={notification} />
            </li>
          ))
        )}
      </ul>
    </InfiniteScroll>
  );
};
