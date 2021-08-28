import React, { useMemo } from "react"
import { SpaceOptions } from "~/types/app"
import { BacklogProject } from "~/types/backlog";

export type Props = {
  space: SpaceOptions;
  project: BacklogProject;
}

export const ProjectListItem: React.VFC<Props> = ({ space, project }) => {
  const projectIconUrl = useMemo(() => {
    const searchParams = new URLSearchParams();

    searchParams.append('apiKey', space.apiKey);

    return `https://${space.domain}/api/v2/projects/${project.projectKey}/image?${searchParams}`;
  }, [space, project]);
  
  return (
    <div className="flex items-center w-full px-4 group">
      <img src={projectIconUrl} alt="" width="48" height="48" />
      <div className="ml-2">
        <h2>{project.name}</h2>
        <div className="h-2">
          <p className="group-hover:hidden mt-0.5 text-xs text-gray-600">{project.projectKey}</p>
          <p className="hidden text-xs group-hover:block">navigation</p>
        </div>
      </div>
    </div>
  )
};  