import { Link, useLocation } from "react-router";

export function DesktopSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "block rounded-lg px-3 py-2 transition-colors";
    const activeClass = "bg-teal-600 font-semibold text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700";
    const inactiveClass = "font-medium hover:bg-neutral-100 hover:text-black dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <div
      data-slot="card"
      className="inset-shadow-2xs bg-card text-card-foreground flex-col gap-6 rounded-xl hidden w-64 shrink-0 p-4 shadow-lg lg:block h-fit"
    >
      <nav className="space-y-1 text-sm">
        <h3 className="mb-2 text-lg font-bold ">Admin Menu</h3>
        <Link
          className={getLinkClass("/")}
          to="/"
        >
          <span>video</span>
        </Link>
        <Link
          className={getLinkClass("/short")}
          to="/short"
        >
          <span>Short</span>
        </Link>
        <Link
          className={getLinkClass("/test")}
          to="/test"
        >
          <span>Test</span>
        </Link>
        <Link
          className={getLinkClass("/videos-list")}
          to="/videos-list"
        >
          <span>Videos</span>
        </Link>
      </nav>
    </div>
  );
}

export function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "rounded-md px-3 py-2 transition-colors";
    const activeClass = "bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white";
    const inactiveClass = "text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="flex flex-wrap lg:hidden p-2 items-center justify-start gap-4 text-sm ">
      <Link
        className={getLinkClass("/")}
        to="/"
      >
        <span>video</span>
      </Link>
      <Link
        className={getLinkClass("/short")}
        to="/short"
      >
        <span>Short</span>
      </Link>
      <Link
        className={getLinkClass("/test")}
        to="/test"
      >
        <span>Test</span>
      </Link>
      <Link
        className={getLinkClass("/videos-list")}
        to="/videos-list"
      >
        <span>Videos</span>
      </Link>
    </nav>
  );
}
