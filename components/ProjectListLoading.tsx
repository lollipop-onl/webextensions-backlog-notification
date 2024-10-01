import { range } from "lodash-es";
import type React from "react";
import { ProjectSkeleton } from "~/components/ProjectSkeleton";

export const ProjectListLoading: React.VFC = () => {
	return (
		<div>
			{range(6).map((index) => (
				<div key={index} className="border-b last:border-b-0">
					<ProjectSkeleton />
				</div>
			))}
		</div>
	);
};
