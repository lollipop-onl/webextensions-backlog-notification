import type React from "react";

export const NotificationSkeleton: React.VFC = () => {
	return (
		<div className="px-4 py-2 animate-pulse">
			<div className="flex items-center">
				<div className="w-1/2 h-4 bg-gray-300 rounded" />
				<div className="w-16 h-4 ml-auto bg-gray-300 rounded-full" />
				<div className="w-10 h-3 ml-1 bg-gray-300 rounded" />
			</div>
			<div className="w-full h-4 mt-2 bg-gray-300 rounded " />
			<div className="w-3/4 h-3 mt-1.5 bg-gray-300 rounded " />
		</div>
	);
};
