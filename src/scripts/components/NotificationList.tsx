import React from 'react'
import { NotificationItem } from './NotificationItem'
import { useBacklogResource } from '~/hooks/backlog'

export const NotificationList: React.VFC = () => {
  const { data: notifications = [] } = useBacklogResource('/api/v2/notifications', {})

  return (
    <ul className="w-full">
      {notifications.map((notification) => (
        <li key={notification.id} className="border-b border-gray-400 last:border-none">
          <NotificationItem notification={notification} />
        </li>
      ))}
    </ul>
  )
}
