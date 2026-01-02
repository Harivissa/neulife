import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const AppLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageSelector />
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};
