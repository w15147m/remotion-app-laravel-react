import { Navbar } from "./Navbar";
import { DesktopSidebar, MobileNav } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
        <MobileNav />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:flex-row content-center">
          <DesktopSidebar />
          <div >
            {children}
          </div>

        </div>
      </main>
    </div>
  );
}
