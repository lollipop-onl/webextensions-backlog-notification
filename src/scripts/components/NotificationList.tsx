import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import http from 'ky-universal'
import { BacklogAPIEndpoints } from '~/api/types'
import { NotificationItem } from '~/components/NotificationItem'
import { getSpacesFromStorage } from '~/utils/webextension'

export const NotificationList: React.VFC = () => {
  const reachingGuide = useRef<HTMLDivElement>(null);
  const { data: spaces } = useSWR('webextension.storage.spaces', () => getSpacesFromStorage(), { suspense: true });
  const { data: notificationPages = [], size, setSize } = useSWRInfinite<BacklogAPIEndpoints['get']['/api/v2/notifications']['response']>((pageIndex, previousPageData) => {
    const space = spaces?.[0];

    if (!space || (previousPageData?.length === 0)) {
      return null;
    }

    const lastNotification = previousPageData?.slice().pop();

    const searchParams = new URLSearchParams();

    searchParams.set('count', '30');
    searchParams.set('apiKey', space.apiKey);

    if (lastNotification) {
      searchParams.set('maxId', lastNotification.id.toString())
    }

    return `https://${space.domain}/api/v2/notifications?${searchParams.toString()}`
  }, (url) => http(url).then((res) => res.json()), { suspense: true })

  const isEmpty = useMemo(() => notificationPages[0]?.length === 0, [notificationPages])
  const isReacingEnd = useMemo(() => isEmpty || notificationPages.slice().pop()?.length !== 30, [isEmpty, notificationPages])

  const observer = useMemo(() => new IntersectionObserver((entities) => {
    if (!notificationPages[size - 1]) {
      return
    }
    
    const isIntersecting = entities.some((entity) => entity.isIntersecting);

    if (!isIntersecting) {
      return
    }
    
    setSize(size + 1);
  }, {
    threshold: 0.25,
  }), [size, setSize, notificationPages])

  useEffect(() => {
    if (!reachingGuide.current) {
      return;
    }

    observer.observe(reachingGuide.current);

    return () => {
      if (reachingGuide.current) {
        observer.unobserve(reachingGuide.current);
      }
    }
  }, [reachingGuide, observer])

  useEffect(() => {
    return () => {
      observer.disconnect();
    }
  }, [observer]);
  
  return (
    <div>
      <ul className="w-full">
        {notificationPages.flatMap((notifications) => notifications.map((notification, index) => (
          <li key={notification.id} className="border-b border-gray-400 last:border-none">
            <NotificationItem notification={notification} />
          </li>
        )))}
      </ul>
      { !isReacingEnd && notificationPages.length >= 1 && (
        <div ref={reachingGuide} className="py-4 text-sm text-center text-gray-600">loading...</div>
      ) }
    </div>
  )
}
