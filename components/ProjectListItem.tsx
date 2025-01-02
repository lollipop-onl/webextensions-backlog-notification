import React, { useMemo } from 'react';
import { browser } from 'wxt/browser';
import { PlusIcon, ViewListIcon } from '@heroicons/react/outline/esm';
import { SpaceOptions } from '~/types/app';
import { BacklogProject } from '~/types/backlog';

type Props = {
  space: SpaceOptions;
  project: BacklogProject;
};

export const ProjectListItem: React.VFC<Props> = ({ space, project }) => {
  const projectIconUrl = useMemo(() => {
    const searchParams = new URLSearchParams();

    searchParams.append('apiKey', space.apiKey);

    return `https://${space.domain}/api/v2/projects/${project.projectKey}/image?${searchParams}`;
  }, [space, project]);

  const openNewIssuePage = async () => {
    await browser.tabs.create({
      url: `https://${space.domain}/add/${project.projectKey}`,
    });

    window.close();
  };

  const openIssueListPage = async () => {
    await browser.tabs.create({
      url: `https://${space.domain}/find/${project.projectKey}`,
    });

    window.close();
  };

  return (
    <div className="flex items-center w-full px-4 py-3 group">
      <div className="flex-shrink-0">
        <img src={projectIconUrl} alt="" width="48" height="48" />
      </div>
      <div className="min-w-0 mx-2">
        <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
          {project.name}
        </h2>
        <p className="mt-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-gray-600">
          {project.projectKey}
        </p>
      </div>
      <div className="flex items-center flex-shrink-0 ml-auto transition-opacity opacity-40 group-hover:opacity-100">
        <button
          className="p-2 transition-colors rounded hover:bg-gray-600 hover:text-gray-100"
          onClick={openNewIssuePage}
        >
          <PlusIcon className="h-6" />
        </button>
        <button
          className="p-2 transition-colors rounded hover:bg-gray-600 hover:text-gray-100"
          onClick={openIssueListPage}
        >
          <ViewListIcon className="h-6" />
        </button>
      </div>
    </div>
  );
};
