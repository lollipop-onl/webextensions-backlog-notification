import React from 'react'
import { range } from 'lodash-es';
import { ProjectSkeleton } from '~/components/ProjectSkeleton';

export const ProjectListLoading: React.VFC = () => {
  return (
    <div>
      {range(6).map((index) => (
        <div key={index} className="border-b last:border-b-0">
          <ProjectSkeleton />
        </div>
      ))}
    </div>
  )
}