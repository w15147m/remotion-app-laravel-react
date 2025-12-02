import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Sidebar from './Sidebar';
interface Props {
    breadcrumb?: BreadcrumbItem[];
    children: React.ReactNode;
    pageInfo?: {
        title: string | null;
        btnText?: string | null;
        url: string | null;
    };
}
export default function CommonLayout({
    children,
    breadcrumb,
    pageInfo,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:flex-row">
                <Sidebar />
                <div className="min-w-0 flex-1">
                    <Card className="overflow-hidden p-0 shadow-lg">
                        <div className="overflow-x-auto border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex justify-between px-5 pt-5">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    {pageInfo?.title}
                                </h3>
                                {pageInfo?.btnText && (
                                    <Button asChild>
                                        <Link href={pageInfo?.url || '#'}>
                                            <Plus className="size-4" />
                                            {pageInfo?.btnText}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                            {children}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
