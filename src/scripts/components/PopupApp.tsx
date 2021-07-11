import React, { Suspense } from "react";
import { NotificationList } from "~/components/NotificationList";
import backlogImage from '~~/images/backlog.png';

const LoadingView: React.VFC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="flex text-xl font-light text-gray-600">
      <img className="h-8 mr-3" src={backlogImage} alt="Backlog" /> Notification Extension
    </div>
    <p className="mt-4 text-sm text-gray-400">by lollipop.onl</p>
  </div>
)

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-full mx-auto">
      <div className="max-w-full w-[480px]">
        <Suspense fallback={<LoadingView />}>
          <NotificationList />
        </Suspense>
      </div>
    </div>
  );
}
