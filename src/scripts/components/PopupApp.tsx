import React from "react";
import { AppNavigation } from "./AppNavigation";

export const PopupApp: React.VFC = () => {
  return (
    <div className="max-w-screen-md max-h-[640px] mx-auto">
      <div className="max-w-full w-[480px]">
        <div className="sticky b-0 l-0">
          <AppNavigation />
        </div>
      </div>
    </div>
  );
}
