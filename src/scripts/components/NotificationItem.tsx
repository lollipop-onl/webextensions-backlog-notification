import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { browser } from 'webextension-polyfill-ts';
import dayjs from 'dayjs';
import { ExternalLinkIcon, EyeIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { getSpacesFromStorage } from '~/utils/webextension';
import { BacklogNotification } from '~/types/backlog';
import { requestBacklogAPI } from '~/api';

type Props = {
  notification: BacklogNotification;
};

export const NotificationReason: React.VFC<{ reason: number }> = ({
  reason,
}) => {
  switch (reason) {
    // 課題の担当者に設定
    case 1:
      return (
        <span>
          が<span className="px-1 text-green-700">担当者</span>
          に設定しました。
        </span>
      );
    // 課題にコメント
    case 2:
      return (
        <span>
          が<span className="px-1 text-green-700">コメント</span>
          しました。
        </span>
      );
    // 課題の追加
    case 3:
      return (
        <span>
          が課題を
          <span className="px-1 text-green-700">追加</span>
          しました。
        </span>
      );
    // 課題の更新
    case 4:
      return (
        <span>
          が課題を
          <span className="px-1 text-green-700">更新</span>
          しました。
        </span>
      );
    // ファイルを追加
    case 5:
      return (
        <span>
          が<span className="px-1 text-red-800">ファイルを追加</span>
          しました。
        </span>
      );
    // プロジェクトユーザーの追加
    case 6:
      return (
        <span>
          がプロジェクトに
          <span className="px-1 text-red-800">追加</span>
          しました。
        </span>
      );
    // その他
    case 9:
      return <span>のその他アクション</span>;
    // プルリクエストの担当者に設定
    case 10:
      return (
        <span>
          がプルリクエストの
          <span className="px-1 text-green-700">担当者</span>
          に設定しました。
        </span>
      );
    // プルリクエストにコメント
    case 11:
      return (
        <span>
          がプルリクエストに
          <span className="px-1 text-green-700">コメント</span>
          しました。
        </span>
      );
    // プルリクエストの追加
    case 12:
      return (
        <span>
          がプルリクエストを
          <span className="px-1 text-green-700">追加</span>
          しました。
        </span>
      );
    // プルリクエストの更新
    case 13:
      return (
        <span>
          がプルリクエストを
          <span className="px-1 text-green-700">更新</span>
          しました。
        </span>
      );
    default:
      return <span>のその他アクション</span>;
  }
};

export const NotificationItem: React.VFC<Props> = ({ notification }) => {
  const [isMetaKeyPressing, setMetaKeyPressing] = useState(false);
  const [isShiftKeyPressing, setShiftKeyPressing] = useState(false);
  const [isManuallyAlreadyRead, setManuallyAlreadyRead] = useState(false);
  const { id, resourceAlreadyRead, sender, comment, issue, reason, created } =
    notification;

  const relativeTime = useMemo(() => dayjs(created).fromNow(), [created]);

  const openIssue: React.MouseEventHandler = useCallback(
    async (event) => {
      event.preventDefault();

      const [space] = await getSpacesFromStorage();

      if (!space || !issue) {
        return;
      }

      if (event.metaKey) {
        await requestBacklogAPI(
          'post' as any,
          `/api/v2/notifications/${id}/markAsRead` as any,
          {}
        );

        setManuallyAlreadyRead(true);

        return;
      }

      if (event.shiftKey) {
        if (!issue) {
          return
        }
        
        const $textarea = document.createElement('textarea');

        $textarea.value = `${issue.issueKey} ${issue.summary}`;

        $textarea.classList.add('absolute');
        $textarea.classList.add('opacity-0');
        $textarea.classList.add('w-0');
        $textarea.classList.add('h-0');
        $textarea.classList.add('border-none');
        $textarea.classList.add('bg-none');

        document.body.appendChild($textarea);

        $textarea.select();
        document.execCommand('copy');

        document.body.removeChild($textarea);

        return;
      }

      let url = `https://${space.domain}/view/${issue.issueKey}`;

      if (comment && comment.id) {
        url += `#comment-${comment.id}`;
      }

      await browser.tabs.create({
        url,
      });

      window.close();
    },
    [issue, comment, id]
  );

  useEffect(() => {
    const onKeyboardEvent = (e: KeyboardEvent) => {
      setMetaKeyPressing(e.metaKey);
      setShiftKeyPressing(e.shiftKey);
    };

    window.addEventListener('keydown', onKeyboardEvent);
    window.addEventListener('keyup', onKeyboardEvent);

    return () => {
      window.removeEventListener('keydown', onKeyboardEvent);
      window.removeEventListener('keyup', onKeyboardEvent);
    };
  }, []);

  return (
    <button
      className={clsx('flex w-full px-4 py-2 group hover:bg-yellow-100', {
        'bg-gray-200': resourceAlreadyRead || isManuallyAlreadyRead,
      })}
      onClick={openIssue}
    >
      <div className="flex-grow min-w-0 mr-2 text-left">
        <p className="flex text-xs text-gray-700">
          <span className="font-medium">{sender.name}</span> さん
          <NotificationReason reason={reason} />
          <span
            className={clsx('flex-shrink-0 w-8 ml-auto opacity-0', {
              'group-hover:opacity-100':
                !isMetaKeyPressing ||
                (!resourceAlreadyRead && !isManuallyAlreadyRead),
            })}
          >
            {isMetaKeyPressing ? (
              <EyeIcon className="h-4" />
              ) : (
              <ExternalLinkIcon className="h-4" />
            )}
          </span>
        </p>
        {comment?.content && (
          <p className="mt-1 text-sm leading-4 line-clamp-2">
            {comment.content}
          </p>
        )}
        {issue && (
          <p className="mt-1 overflow-hidden text-xs text-gray-600 overflow-ellipsis whitespace-nowrap">
            <span className="font-medium">{issue.issueKey}</span>{' '}
            {issue.summary}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 ml-auto text-right">
        <p className="text-xs text-gray-600">{relativeTime}</p>
        {issue && (
          <p
            className="max-w-lg px-2 mt-1 text-xs leading-5 text-white rounded-full"
            style={{ backgroundColor: issue.status.color }}
          >
            {issue.status.name}
          </p>
        )}
      </div>
    </button>
  );
};
