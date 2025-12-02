import React from 'react';
import { Head } from '@inertiajs/react';
import CommonLayout from '@/pages/video-admin/layout/commonLayout';
import VideoForm from './components/VideoForm';

declare function route(name: string, parameters?: any): string;

interface Video {
    id: number;
    title: string;
    template_name: string;
    type: 'short' | 'full';
    playlist_id: number | null;
}

interface PlaylistOption {
    id: number;
    name: string;
}

interface VideoEditProps {
    video: Video;
    playlists: PlaylistOption[];
}

const pageInfo = {
    title: 'Edit Video',
    btnText: null,
    url: '',
};

export default function VideoEdit({ video, playlists }: VideoEditProps) {


    return (
        <CommonLayout  pageInfo={pageInfo}>
            <Head title={`Edit: ${video.title}`} />
            <VideoForm video={video} submitRoute="video.update" playlists={playlists} />
        </CommonLayout>
    );
}
