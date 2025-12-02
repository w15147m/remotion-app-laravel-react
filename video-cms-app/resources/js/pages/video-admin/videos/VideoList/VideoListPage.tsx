import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { Video } from 'lucide-react';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';
import EyeButton from '../../components/EditButton copy'; // Assuming this is your Eye/View button
import CommonLayout from '../../layout/commonLayout';
declare function route(name: string, parameters?: any): string;

// 1. UPDATED INTERFACE: Added output_path
interface VideoItem {
    id: number;
    title: string;
    template_name: string;
    type: 'short' | 'full';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    playlist_name: string | null;
    output_path: string | null; // Necessary for the download link
}

interface VideoListPageProps {
    videos: VideoItem[];
}

const getStatusClasses = (status: VideoItem['status']) => {
    switch (status) {
        case 'completed':
            return 'text-green-600 dark:text-green-400 font-semibold';
        case 'processing':
            return 'text-yellow-600 dark:text-yellow-400';
        case 'failed':
            return 'text-red-600 dark:text-red-400';
        case 'pending':
        default:
            return 'text-gray-500 dark:text-gray-400';
    }
};

const pageInfo = {
    title: 'Video Management',
    btnText: 'Create Video',
    url: '/video/create',
};

export default function VideoListPage({ videos }: VideoListPageProps) {
    return (
        <CommonLayout pageInfo={pageInfo}>
            <Head title="Video List" />

            <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Template / Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Playlist
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900/50">
                        {videos &&
                            videos.map((video) => (
                                <tr
                                    key={video.id}
                                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-neutral-900 dark:text-neutral-100">
                                        #{video.id}
                                    </td>
                                    <td className="max-w-xs truncate px-4 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {video.title}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        <span className="font-medium capitalize">
                                            {video.template_name}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-400 uppercase">
                                            ({video.type})
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        {video.playlist_name || '—'}
                                    </td>
                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                        <span
                                            className={getStatusClasses(
                                                video.status,
                                            )}
                                        >
                                            {video.status.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* 2. DYNAMIC ACTIONS CELL (The Integration Point) */}
                                    <td className="space-x-2 px-4 py-4 text-center whitespace-nowrap">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            title={`View ${video.title}`}
                                        >
                                            <Link href={`/video/${video.id}`}>
                                                <Video className="size-4" />
                                            </Link>
                                        </Button>
                                        <EyeButton
                                            route={`/video/Items/${video.id}`}
                                        ></EyeButton>
                                        <EditButton
                                            route={`/video/${video.id}/edit`}
                                        ></EditButton>
                                        <DeleteButton
                                            route={`/video/${video.id}`}
                                        ></DeleteButton>
                                    </td>
                                </tr>
                            ))}
                        {videos && videos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                                >
                                    No videos found. Create a video to get
                                    started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </CommonLayout>
    );
}
