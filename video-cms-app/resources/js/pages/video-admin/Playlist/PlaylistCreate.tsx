import { Head } from '@inertiajs/react';
import CommonLayout from '../layout/commonLayout';
import PlaylistForm from './components/PlaylistForm';

const pageInfo = {
    title: 'Create New Playlist',
    btnText: null,
    url: '',
};
export default function PlaylistCreate() {
    return (
        <CommonLayout pageInfo={pageInfo}>
            <Head title="Create Playlist" />
            <PlaylistForm submitRoute="playlist.store" />
        </CommonLayout>
    );
}
