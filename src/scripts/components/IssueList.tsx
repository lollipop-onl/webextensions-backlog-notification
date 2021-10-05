import React, { useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import http from 'ky-universal';
import InfiniteScroll from 'react-infinite-scroller';
import { IssueListItem } from '~/components/IssueListItem';
import { IssueSkeleton } from '~/components/IssueSkeleton';
import { BacklogAPIEndpoints } from '~/api/types';
import { SpaceOptions } from '~/types/app';

export type Props = {
  space?: SpaceOptions;
};

type BacklogIssues =
  BacklogAPIEndpoints['get']['/api/v2/users/myself/recentlyViewedIssues']['response'];

const LOAD_PER_PAGE = 30;

export const IssueList: React.VFC<Props> = ({ space }) => {
  // SWR のキーを取得する
  const getKey = (
    pageIndex: number,
    previousPageData: BacklogIssues | null
  ) => {
    if (!space || previousPageData?.length === 0) {
      return null;
    }

    const searchParams = new URLSearchParams();

    searchParams.set('count', `${LOAD_PER_PAGE}`);
    searchParams.set('offset', `${pageIndex * LOAD_PER_PAGE}`);
    searchParams.set('apiKey', space.apiKey);

    return `https://${
      space.domain
    }/api/v2/users/myself/recentlyViewedIssues?${searchParams}`;
  };
  // SWR の Fetcher
  const fetcher = (url: string) => http(url).then((res) => res.json());

  const {
    data: issuePages = [],
    size,
    setSize,
  } = useSWRInfinite<BacklogIssues>(getKey, fetcher, { suspense: true, revalidateOnMount: false });

  // お知らせの追加ロード中か
  const isLoadingMore = useMemo(
    () => size > 0 && typeof issuePages[size - 1] === 'undefined',
    [size, issuePages]
  );
  // お知らせが０件か
  const isEmpty = useMemo(
    () => issuePages[0] && issuePages[0].length === 0,
    [issuePages]
  );
  // 無限ロードが終了したか
  const isReachingEnd = useMemo(
    () =>
      isEmpty ||
      issuePages[issuePages.length - 1]?.length < LOAD_PER_PAGE,
    [isEmpty, issuePages]
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
          <IssueSkeleton key={0} />
        </div>
      }
    >
      <ul>
        {issuePages.flatMap((issues) =>
          issues.map(({ issue }, index) => (
            <li
              key={issue.id}
              className="border-b border-gray-400 last:border-none"
            >
              { space && <IssueListItem space={space} issue={issue} /> }
            </li>
          ))
        )}
      </ul>
    </InfiniteScroll>
  );
};
