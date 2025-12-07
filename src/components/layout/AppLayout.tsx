import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-end px-6 gap-3 sticky top-0 z-40">
          <ThemeToggle />
          <LanguageSelector />
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
