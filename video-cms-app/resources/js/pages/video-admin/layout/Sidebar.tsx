import { Card } from '@/components/ui/card';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function Sidebar() {
    const { url } = usePage();
    const mainNavItems: NavItem[] = [
        { title: 'Playlist', href: '/playlist' },
        { title: 'Video List', href: '/video' },
    ];

    // ✅ Large screen sidebar
    const sidebar = (
        <Card className="hidden w-64 shrink-0 p-4 shadow-lg lg:block h-fit">
            <nav className="space-y-1 text-sm">
                <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Admin Menu
                </h3>
                {mainNavItems.map((item) => {
                    const isActive = url.startsWith(item.href as string);
                    return (
                        <Link
                            key={item.title}
                            href={item.href as string}
                            className={`block rounded-lg p-2 transition-colors ${
                                isActive
                                    ? 'bg-neutral-100 font-semibold text-primary dark:bg-neutral-800 dark:text-primary'
                                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            }`}
                        >
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </Card>
    );

    // ✅ Small screen top navbar
    const topNav = (
            <nav className="flex flex-wrap  lg:hidden p-2 items-center justify-start gap-4 text-sm">
                {mainNavItems.map((item) => {
                    const isActive = url.startsWith(item.href as string);
                    return (
                        <Link
                            key={item.title}
                            href={item.href as string}
                            className={`rounded-md px-3 py-2 transition-colors ${
                                isActive
                                    ? 'bg-neutral-100 font-semibold text-primary dark:bg-neutral-800 dark:text-primary'
                                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            }`}
                        >
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
    );

    return (
        <>
            {topNav}
            {sidebar}
        </>
    );
}
