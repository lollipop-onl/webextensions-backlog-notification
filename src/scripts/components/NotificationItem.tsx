import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { browser } from 'webextension-polyfill-ts';
import dayjs from 'dayjs';
import { useKeyPress, useCopyToClipboard } from 'react-use'
import { ExternalLinkIcon, EyeIcon, ClipboardCopyIcon, ArrowRightIcon, FireIcon } from '@heroicons/react/outline';
import { NotificationReason } from '~/components/NotificationReason';
import { getSpacesFromStorage } from '~/utils/webextension';
import { BacklogIssuePriorityId } from '~/constants/backlog';
import { BacklogNotification } from '~/types/backlog';
import { requestBacklogAPI } from '~/api';

type Props = {
  notification: BacklogNotification;
};

export const NotificationItem: React.VFC<Props> = ({ notification }) => {
  const [isMetaKeyPressing] = useKeyPress('Meta');
  const [isShiftKeyPressing] = useKeyPress('Shift');
  const [isManuallyAlreadyRead, setManuallyAlreadyRead] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const { id, resourceAlreadyRead, sender, comment, issue, reason, created } =
    notification;

  const relativeTime = useMemo(() => dayjs(created).fromNow(), [created]);
  const isOverDeadline = useMemo((): boolean => Boolean(issue && issue.status.id !== 4 && issue.dueDate && issue.dueDate.split('T')[0] && dayjs(issue.dueDate.split('T')[0]).isBefore(new Date(), 'date')), [issue]);

  const openIssue: React.MouseEventHandler = useCallback(
    async (event) => {
      event.preventDefault();

      const [space] = await getSpacesFromStorage();

      if (!space || !issue) {
        return;
      }

      if (isMetaKeyPressing) {
        await requestBacklogAPI(
          'post' as any,
          `/api/v2/notifications/${id}/markAsRead` as any,
          {}
        );

        setManuallyAlreadyRead(true);

        return;
      }

      if (isShiftKeyPressing) {
        copyToClipboard(`${issue.issueKey} ${issue.summary}`)
        
        return;
      }

      let url = `https://${space.domain}/view/${issue.issueKey}`;

      if (comment && comment.id) {
        url += `#comment-${comment.id}`;
      }

      await browser.tabs.create({ url });

      window.close();
    },
    [issue, comment, id, isMetaKeyPressing, isShiftKeyPressing, copyToClipboard]
  );

  return (
    <button
      className={clsx('w-full px-4 py-2 group hover:bg-yellow-100', {
        'bg-gray-200': resourceAlreadyRead || isManuallyAlreadyRead,
      })}
      onClick={openIssue}
    >
      <div className="flex items-center">
        <p className="flex min-w-0 text-xs text-gray-700 ">
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            <span className="font-medium">{sender.name}</span> さん
            <NotificationReason reason={reason} />
          </p>
        </p>
        <div className="flex-shrink-0 px-2 ml-auto">
          <div
            className={clsx('hidden', {
              'group-hover:block':
                !isMetaKeyPressing ||
                (!resourceAlreadyRead && !isManuallyAlreadyRead),
            })}
          >
            {isMetaKeyPressing ? (
              <EyeIcon className="h-4" />
            ) : isShiftKeyPressing ? (
              <ClipboardCopyIcon className="h-4" />
            ) : (
              <ExternalLinkIcon className="h-4" />
            )}
          </div>
        </div>
        {isOverDeadline ? (
          <FireIcon className="h-5 mr-1 text-red-600" />
        ) : null}
        {issue && (
          <p
            className="flex-shrink-0 max-w-lg px-2 mr-1 text-xs leading-5 text-white rounded-full"
            style={{ backgroundColor: issue.status.color }}
          >
            {issue.status.name}
          </p>
        )}
        <p className="flex-shrink-0 text-xs text-gray-600">{relativeTime}</p>
      </div>
      {comment?.content && (
        <p className="mt-1 text-sm leading-4 text-left break-all line-clamp-2">
          {comment.content}
        </p>
      )}
      {issue && (
        <p className="flex items-center mt-1 mr-2 text-xs text-gray-600">
          <ArrowRightIcon
            className={clsx('h-4 block flex-shrink-0', {
              'text-priority-high transform -rotate-90': issue.priority.id === BacklogIssuePriorityId.HIGH,
              'text-priority-medium': issue.priority.id === BacklogIssuePriorityId.MEDIUM,
              'text-priority-low transform rotate-90': issue.priority.id === BacklogIssuePriorityId.LOW,
            })}
          />
          <span className="flex-shrink-0 block mx-1 font-medium">{issue.issueKey}</span>
          <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {issue.summary}
          </h3>
        </p>
      )}
    </button>
  );
};
