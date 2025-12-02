import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react'; // Import Plus icon
import DeleteButton from '../components/DeleteButton';
import EditButton from '../components/EditButton';
import CommonLayout from '../layout/commonLayout';

// --- 1. Define Props Interface (Remains the same) ---

interface Playlist {
    id: number;
    name: string;
    description: string | null;
}

interface PlaylistPageProps {
    playlists: Playlist[];
}

// --- 2. The Playlist Component ---


const pageInfo = {
    title: ' Playlist Management ',
    btnText: 'Create',
    url: '/playlist/create',
}
export default function PlaylistPage({ playlists }: PlaylistPageProps) {
    return (
        <CommonLayout pageInfo={pageInfo}>
            <Head title="Playlists" />
            <div className="pt-2">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Playlist Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900/50">
                            {playlists.map((playlist) => (
                                <tr
                                    key={playlist.id}
                                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-neutral-900 dark:text-neutral-100">
                                        #{playlist.id}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {playlist.name}
                                    </td>
                                    <td className="max-w-sm truncate px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        {playlist.description ||
                                            'No description provided.'}
                                    </td>

                                    {/* Actions Cell with Icon Buttons */}
                                    <td className="space-x-2 px-4 py-4 text-center whitespace-nowrap">
                                        {/* Edit Button */}
                                        <EditButton
                                            route={`/playlist/${playlist.id}/edit`}
                                        ></EditButton>
                                        {/* Delete Button */}
                                        <DeleteButton
                                            route={`playlist/${playlist.id}`}
                                        ></DeleteButton>
                                    </td>
                                </tr>
                            ))}
                            {playlists.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                                    >
                                        No playlists found. Start by creating a
                                        new one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </CommonLayout>
    );
}
