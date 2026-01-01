import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
      >
        Skip to main content
      </a>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex w-full flex-col gap-8 px-6 py-6 lg:ml-72 lg:px-10 lg:py-10">
          <TopBar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <div className="fade-in-up space-y-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
