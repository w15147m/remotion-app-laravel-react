import { Head } from '@inertiajs/react';
import CommonLayout from '../../layout/commonLayout';
import VideoItemForm from './components/VideoItemForm';
declare function route(name: string, parameters?: any): string;

interface VideoItemCreateProps {
    video: { id: number; title: string };
}

export default function VideoItemCreate({ video }: VideoItemCreateProps) {
    const pageInfo = {
        title: `Create Item for: ${video.title}`,
        btnText: null,
        url: '',
    };

    return (
        <CommonLayout pageInfo={pageInfo}>
            <Head title={`Create Item for: ${video.title}`} />
            <VideoItemForm videoId={video.id} submitRoute="videoItem.store" />
        </CommonLayout>
    );
}
