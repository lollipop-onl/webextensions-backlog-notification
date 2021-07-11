import React, { Suspense } from "react";
import { NotificationList } from "~/components/NotificationList";

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-full mx-auto">
      <div className="max-w-full w-[480px]">
        <Suspense fallback={<p>loading...</p>}>
          <NotificationList />
        </Suspense>
      </div>
    </div>
  );
}
