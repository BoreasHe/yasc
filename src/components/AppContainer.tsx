import type { ReactNode } from "react";

export const AppContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-0 md:px-4">
      <div className="min-h-screen flex flex-row max-w-[1280px] mx-auto gap-6">
        {children}
      </div>
    </div>
  );
};
