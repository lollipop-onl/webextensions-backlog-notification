import { range } from "lodash-es";
import type React from "react";
import { IssueSkeleton } from "~/components/IssueSkeleton";

export const IssueListLoading: React.VFC = () => (
	<div>
		{range(6).map((index) => (
			<div key={index} className="border-b border-gray-400 last:border-none">
				<IssueSkeleton />
			</div>
		))}
	</div>
);
