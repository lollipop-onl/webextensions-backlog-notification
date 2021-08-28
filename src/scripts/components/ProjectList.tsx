import React from 'react';
import useSWR from 'swr';
import http from 'ky-universal';
import { SpaceOptions } from '~/types/app';
import { BacklogAPIEndpoints } from '~/api/types';
import { ProjectListItem } from './ProjectListItem';

export type Props = {
  space?: SpaceOptions;
};

type BacklogProjects =
  BacklogAPIEndpoints['get']['/api/v2/projects']['response'];

export const ProjectList: React.VFC<Props> = ({ space }) => {
  // SWR のキーを取得する
  const getKey = () => {
    if (!space) {
      return null;
    }

    const searchParams = new URLSearchParams();

    searchParams.append('archived', 'false');
    searchParams.append('apiKey', space.apiKey);

    return `https://${space.domain}/api/v2/projects?${searchParams}`;
  }
  // SWR の fetcher
  const fetcher = (url: string) => http(url).then((res) => res.json());

  const { data: projects } = useSWR<BacklogProjects>(getKey, fetcher);

  if (!projects || !space) {
    return null;
  }

  return (
    <div>
      <ol>
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectListItem space={space} project={project} />
          </li>
        ))}
      </ol>
    </div>
  );
};
