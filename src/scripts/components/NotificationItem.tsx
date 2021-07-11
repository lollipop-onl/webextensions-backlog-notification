import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { browser } from "webextension-polyfill-ts";
import dayjs from "dayjs";
import { ExternalLinkIcon, EyeIcon } from '@heroicons/react/outline'
import { getSpacesFromStorage } from "~/utils/webextension";
import { BacklogNotification } from "~/types/backlog";
import { requestBacklogAPI } from "~/api";

type Props = {
  notification: BacklogNotification;
}

export const NotificationReason: React.VFC<{ reason: number }> = ({ reason }) => {
  switch (reason) {
    // 課題の担当者に設定
    case 1:
    // 課題にコメント
    case 2:
    // 課題の追加
    case 3:
    // 課題の更新
    case 4:
    // ファイルを追加
    case 5:
    // プロジェクトユーザーの追加
    case 6:
    // その他
    case 9:
    // プルリクエストの担当者に設定
    case 10:
    // プルリクエストにコメント
    case 11:
    // プルリクエストの追加
    case 12:
    // プルリクエストの更新
    case 13:
    default:
      return <span>その他</span>
  }
}

export const NotificationItem: React.VFC<Props> = ({ notification }) => {
  const [isMetaKeyPressing, setMetaKeyPressing] = useState(false);
  const { id, resourceAlreadyRead, sender, comment, issue, reason, created } = notification;

  const relativeTime = useMemo(() => dayjs(created).fromNow(), [created])

  const openIssue: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    
    const [space] = await getSpacesFromStorage();

    if (!space || !issue) {
      return;
    }

    if (event.metaKey) {
      await requestBacklogAPI('post' as any, `/api/v2/notifications/${id}/markAsRead` as any, {});

      return;
    }

    let url = `https://${space.domain}/view/${issue.issueKey}`;

    if (comment && comment.id) {
      url += `#comment-${comment.id}`;
    }

    await browser.tabs.create({
      url
    });

    window.close();
  }, [issue])

  useEffect(() => {
    const onKeyboardEvent = (e: KeyboardEvent) => {
      setMetaKeyPressing(e.metaKey);
    }
    
    window.addEventListener('keydown', onKeyboardEvent);
    window.addEventListener('keyup', onKeyboardEvent);
    
    return () => {
      window.removeEventListener('keydown', onKeyboardEvent);
      window.removeEventListener('keyup', onKeyboardEvent);
    }
  }, [])
  
  return (
    <a href="#" className={clsx('flex px-4 py-2 group hover:bg-yellow-100', { 'bg-gray-200': resourceAlreadyRead })} onClick={openIssue}>
      <div className="flex-grow min-w-0 mr-2">
        <p className="flex text-xs text-gray-700">
          <span className="font-medium">{sender.name}</span> さんが<NotificationReason reason={reason} />
          <span className={clsx('flex-shrink-0 w-8 ml-auto opacity-0', { 'group-hover:opacity-100': !isMetaKeyPressing || !resourceAlreadyRead })}>
            {isMetaKeyPressing ? <EyeIcon className="h-4" /> : <ExternalLinkIcon className="h-4" />}
          </span>
        </p>
        { comment?.content && <p className="mt-1 text-sm leading-4 line-clamp-2">{comment.content}</p> }
        { issue && <p className="mt-1 overflow-hidden text-xs text-gray-600 overflow-ellipsis whitespace-nowrap">
          <span className="font-medium">{issue.issueKey}</span> {issue.summary}</p> }
      </div>
      <div className="flex-shrink-0 ml-auto text-right">
        <p className="text-xs text-gray-600">{relativeTime}</p>
        { issue && <p className="max-w-lg px-2 mt-1 text-xs leading-5 text-white rounded-full" style={{ backgroundColor: issue.status.color }}>{issue.status.name}</p> }
      </div>
    </a>
  )
}
