import { PlusIcon, ViewListIcon } from "@heroicons/react/outline";
import type React from "react";

export const ProjectSkeleton: React.FC = () => {
	return (
		<div className="flex items-center px-4 py-3 animate-pulse">
			<div className="w-12 h-12 bg-gray-300 rounded" />
			<div className="flex-grow mx-2">
				<div className="w-1/2 h-5 bg-gray-300 rounded" />
				<div className="w-1/4 h-3 mt-1 bg-gray-300 rounded" />
			</div>
			<div className="p-2">
				<PlusIcon className="h-6 text-gray-300" />
			</div>
			<div className="p-2">
				<ViewListIcon className="h-6 text-gray-300" />
			</div>
		</div>
	);
};
