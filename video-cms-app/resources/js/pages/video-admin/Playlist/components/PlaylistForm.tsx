import React, { FormEventHandler } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // Assuming you have a Card component
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { log } from 'console';
declare function route(name: string, parameters?: any): string;
interface FormData {
    name: string;
    description: string;
}

interface PlaylistFormProps {
    playlist?: { id: number; name: string; description: string | null };
    submitRoute: string;
}

export default function PlaylistForm({ playlist, submitRoute }: PlaylistFormProps) {
    const isEditing = !!playlist;
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: playlist?.name ?? '',
        description: playlist?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const routeParams = isEditing ? { playlist: playlist.id } : {};
        if (isEditing) {
            put(route(submitRoute, routeParams));
        } else {
            post(route(submitRoute));
        }
    };

    return (
        <div className="p-6 pt-0">
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Playlist Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={errors.description ? 'border-red-500' : ''}
                        rows={4}
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <Button type="submit" disabled={processing}>
                        {isEditing ? 'Update Playlist' : 'Create Playlist'}
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={route('playlist.index')}>Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
