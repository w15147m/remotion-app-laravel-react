import React, { FormEventHandler } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
declare function route(name: string, parameters?: any): string;

// Interfaces based on Video model fields
interface VideoFormData {
    title: string;
    template_name: string;
    type: 'short' | 'full';
    playlist_id: string; // Must be string for Select, either ID or 'null_playlist'
}

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

interface VideoFormProps {
    video?: Video;
    submitRoute: string;
    playlists: PlaylistOption[];
}

export default function VideoForm({ video, submitRoute, playlists }: VideoFormProps) {
    const isEditing = !!video;
    const { data, setData, post, put, processing, errors } = useForm<VideoFormData>({
        title: video?.title ?? '',
        template_name: video?.template_name ?? '',
        type: video?.type ?? 'short',
        playlist_id: video?.playlist_id ? String(video.playlist_id) : 'null_playlist',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const routeParams = isEditing ? { video: video.id } : {};

        const submitData = {
            ...data,
            playlist_id: data.playlist_id === 'null_playlist' ? null : data.playlist_id,
        };

        if (isEditing) {
            put(route(submitRoute, routeParams), { data: submitData });
        } else {
            post(route(submitRoute), { data: submitData });
        }
    };

    return (
        <div className="p-6 pt-0">
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="template_name">Template Name</Label>
                        <Input
                            id="template_name"
                            type="text"
                            value={data.template_name}
                            onChange={(e) => setData('template_name', e.target.value)}
                            className={errors.template_name ? 'border-red-500' : ''}
                        />
                        {errors.template_name && <p className="text-sm text-red-500 mt-1">{errors.template_name}</p>}
                    </div>

                    <div className="w-1/3">
                        <Label htmlFor="type">Video Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(value) => setData('type', value as 'short' | 'full')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short">Short</SelectItem>
                                <SelectItem value="full">Full</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="playlist_id">Playlist (Optional)</Label>
                    <Select
                        value={data.playlist_id}
                        onValueChange={(value) => setData('playlist_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Playlist" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="null_playlist">No Playlist</SelectItem>
                            {playlists.map((playlist) => (
                                <SelectItem key={playlist.id} value={String(playlist.id)}>
                                    {playlist.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.playlist_id && <p className="text-sm text-red-500 mt-1">{errors.playlist_id}</p>}
                </div>

                <div className="flex items-center justify-end space-x-2">
                    <Button type="submit" disabled={processing}>
                        {isEditing ? 'Update Video' : 'Create Video'}
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={route('video.index')}>Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
