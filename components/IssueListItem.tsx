import React, { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { FireIcon } from '@heroicons/react/outline/esm';
import { browser } from 'wxt/browser';
import { BacklogIssue } from '~/types/backlog';
import { SpaceOptions } from '~/types/app';

type Props = {
  space: SpaceOptions;
  issue: BacklogIssue;
}

export const IssueListItem: React.VFC<Props> = ({ space, issue }) => {
  const isOverDeadline = useMemo(
    (): boolean =>
      Boolean(
        issue &&
          issue.status.id !== 4 &&
          issue.dueDate &&
          issue.dueDate.split('T')[0] &&
          dayjs(issue.dueDate.split('T')[0]).isBefore(new Date(), 'date')
      ),
    [issue]
  );

  const openIssue: React.MouseEventHandler = useCallback(
    async (event) => {
      event.preventDefault();


      let url = `https://${space.domain}/view/${issue.issueKey}`;

      await browser.tabs.create({ url });

      window.close();
    },
    [space, issue]
  );

  return (
    <button
      className="w-full px-4 py-2 text-left group hover:bg-yellow-100"
      onClick={openIssue}
    >
      <span className="flex items-center">
        <span className="inline-block mr-auto text-xs text-gray-700">
          {issue.issueKey}
        </span>
        { isOverDeadline && <FireIcon className="h-5 mr-1 text-red-600" /> }
        <span
          className="flex-shrink-0 block max-w-lg px-2 mr-1 text-xs leading-5 text-white rounded-full"
          style={{ backgroundColor: issue.status.color }}
        >
          {issue.status.name}
        </span>
      </span>
      <span className="block mt-1 text-sm leading-4 break-all line-clamp-2">{issue.summary}</span>
    </button>
  )
}