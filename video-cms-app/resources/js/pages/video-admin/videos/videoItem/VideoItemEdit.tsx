import { Head } from '@inertiajs/react';
import CommonLayout from '../../layout/commonLayout';
import VideoItemForm from './components/VideoItemForm';
declare function route(name: string, parameters?: any): string;

interface VideoItem {
    id: number;
    video_id: number;
    sequence: number;
    title: string | null;
    heading: string | null;
    year: number | null;
    rank_number: number | null;
    rank_type: string | null;
    detail_text: string | null;
    media_url: string | null;
     country?: string | null; // ✅ add this line
}

interface VideoItemEditProps {
    video: { id: number; title: string };
    video_item: VideoItem;
}

export default function VideoItemEdit({ video, video_item }: VideoItemEditProps) {
    const pageInfo = {
        title: `Edit Item #${video_item.sequence} for: ${video.title}`,
        btnText: null,
        url: '',
    };

    return (
        <CommonLayout pageInfo={pageInfo}>
            <Head title={`Edit Item: ${video.title}`} />
            <VideoItemForm
                videoId={video.id}
                videoItem={video_item}
                submitRoute="videoItem.update"
            />
        </CommonLayout>
    );
}
