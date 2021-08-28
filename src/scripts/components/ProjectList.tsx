import React from 'react';
import useSWR from 'swr';
import http from 'ky-universal';
import { SpaceOptions } from '~/types/app';
import { BacklogAPIEndpoints } from '~/api/types';
import { ProjectListItem } from '~/components/ProjectListItem';

export type Props = {
  space?: SpaceOptions;
};

type BacklogRecentlyViewedProjectsProjects =
  BacklogAPIEndpoints['get']['/api/v2/users/myself/recentlyViewedProjects']['response'];

export const ProjectList: React.VFC<Props> = ({ space }) => {
  // SWR のキーを取得する
  const getKey = () => {
    if (!space) {
      return null;
    }

    const searchParams = new URLSearchParams();

    // TODO: 無限ロードに対応する
    searchParams.append('count', '100');
    searchParams.append('apiKey', space.apiKey);

    return `https://${space.domain}/api/v2/users/myself/recentlyViewedProjects?${searchParams}`;
  }
  // SWR の fetcher
  const fetcher = (url: string) => http(url).then((res) => res.json());

  const { data: projects } = useSWR<BacklogRecentlyViewedProjectsProjects>(getKey, fetcher, { suspense: true, revalidateOnMount: false });

  console.log(projects);

  if (!projects || !space) {
    return null;
  }

  return (
    <div>
      <ol>
        {projects.map(({ project }) => (
          <li key={project.id} className="border-b last:border-b-0">
            <ProjectListItem space={space} project={project} />
          </li>
        ))}
      </ol>
    </div>
  );
};
