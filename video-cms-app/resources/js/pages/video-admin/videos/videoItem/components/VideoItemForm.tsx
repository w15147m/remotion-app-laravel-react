import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageGalleryInput from '@/pages/video-admin/components/ImageGalleryInput';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

declare function route(name: string, parameters?: any): string;

interface VideoItemFormProps {
    videoItem?: VideoItem;
    videoId: number;
    submitRoute: string;
}

interface VideoItemFormData {
    title: string;
    subtitle: string;
    heading: string;
    icon: string;
    country: string;
    year: string;
    year_range: string;
    rank_number: string;
    rank_type: string;
    rank_label: string;
    label: string;
    detail_text: string;
    image_url: string;
    video_id: number;
    type: string;
}

interface VideoItem {
    id: number;
    video_id: number;
    sequence: number;
    title: string | null;
    subtitle: string | null;
    heading: string | null;
    icon: string | null;
    country: string | null;
    year: number | null;
    year_range: string | null;
    rank_number: number | null;
    rank_type: string | null;
    rank_label: string | null;
    label: string | null;
    detail_text: string | null;
    image_url: string | null;
    type: string | null;
}

export default function VideoItemForm({
    videoItem,
    videoId,
    submitRoute,
}: VideoItemFormProps) {
    const isEditing = !!videoItem;

    // ✅ Country list (memoized for performance)
    const countryOptions = useMemo(() => countryList().getData(), []);

    const { data, setData, post, put, processing, errors } = useForm<
        VideoItemFormData & { gallery: any }
    >({
        title: videoItem?.title ?? '',
        subtitle: videoItem?.subtitle ?? '',
        heading: videoItem?.heading ?? '',
        icon: videoItem?.icon ?? '',
        country: videoItem?.country ?? '',
        year: videoItem?.year?.toString() ?? '',
        year_range: videoItem?.year_range ?? '',
        rank_number: videoItem?.rank_number?.toString() ?? '',
        rank_type: videoItem?.rank_type ?? '',
        rank_label: videoItem?.rank_label ?? '',
        label: videoItem?.label ?? '',
        detail_text: videoItem?.detail_text ?? '',
        image_url: videoItem?.image_url ?? '',
        video_id: videoId,
        type: videoItem?.type ?? 'short',
        gallery: {},
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const routeParams = isEditing ? { videoItem: videoItem.id } : {};
        const submitData = { ...data };

        if (isEditing) {
            put(route(submitRoute, routeParams), { data: submitData });
        } else {
            post(route(submitRoute), { data: submitData });
        }
    };

    return (
        <div className="p-6 pt-0">
            <form onSubmit={submit} className="space-y-6">
                {/* === Grid Layout === */}
                <div className="grid grid-cols-[220px_1fr] items-start gap-4">
                    {/* ✅ Left column — Image Upload */}
                    <div>
                        <div className="w-full max-w-[220px]">
                            <Label>Image (Optional)</Label>
                            <ImageGalleryInput
                                initialGalleryImages={
                                    data.image_url
                                        ? [
                                            {
                                                id: 1,
                                                image_url: data.image_url,
                                                name: 'Selected',
                                            },
                                        ]
                                        : []
                                }
                                onGalleryChange={(images) => {
                                    if (images.length > 0) {
                                        setData('gallery', images[0]);
                                        setData('image_url', images[0].image_url);
                                    } else {
                                        setData('image_url', '');
                                    }
                                }}
                                isSingle={true}
                                isEditing={isEditing}
                            />
                            {errors.image_url && (
                                <p className="mt-1 text-sm text-red-500">{errors.image_url}</p>
                            )}
                        </div>
                    </div>

                    {/* ✅ Right column — Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => setData('subtitle', e.target.value)}
                                className={errors.subtitle ? 'border-red-500' : ''}
                            />
                            {errors.subtitle && (
                                <p className="mt-1 text-sm text-red-500">{errors.subtitle}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="heading">Heading</Label>
                            <Input
                                id="heading"
                                type="text"
                                value={data.heading}
                                onChange={(e) => setData('heading', e.target.value)}
                                className={errors.heading ? 'border-red-500' : ''}
                            />
                            {errors.heading && (
                                <p className="mt-1 text-sm text-red-500">{errors.heading}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="icon">Icon/Emoji</Label>
                            <Input
                                id="icon"
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className={errors.icon ? 'border-red-500' : ''}
                                placeholder="⚽"
                            />
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className={errors.year ? 'border-red-500' : ''}
                                />
                                {errors.year && (
                                    <p className="mt-1 text-sm text-red-500">{errors.year}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="year_range">Year Range</Label>
                                <Input
                                    id="year_range"
                                    type="text"
                                    value={data.year_range}
                                    onChange={(e) => setData('year_range', e.target.value)}
                                    className={errors.year_range ? 'border-red-500' : ''}
                                    placeholder="1956-1977"
                                />
                                {errors.year_range && (
                                    <p className="mt-1 text-sm text-red-500">{errors.year_range}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="rank_number">Rank Number</Label>
                                <Input
                                    id="rank_number"
                                    type="number"
                                    value={data.rank_number}
                                    onChange={(e) =>
                                        setData('rank_number', e.target.value)
                                    }
                                    className={errors.rank_number ? 'border-red-500' : ''}
                                />
                                {errors.rank_number && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.rank_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="rank_label">Rank Label</Label>
                                <Input
                                    id="rank_label"
                                    type="text"
                                    value={data.rank_label}
                                    onChange={(e) => setData('rank_label', e.target.value)}
                                    className={errors.rank_label ? 'border-red-500' : ''}
                                    placeholder="Goals"
                                />
                                {errors.rank_label && (
                                    <p className="mt-1 text-sm text-red-500">{errors.rank_label}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ New Country Dropdown */}
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Select
                                id="country"
                                options={countryOptions}
                                value={countryOptions.find(
                                    (option) => option.value === data.country
                                )}
                                onChange={(value) => setData('country', value?.value || '')}
                                className="text-sm"
                                placeholder="Select a country"
                            />
                            {errors.country && (
                                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="rank_type">Rank Type</Label>
                                <Input
                                    id="rank_type"
                                    type="text"
                                    value={data.rank_type}
                                    onChange={(e) => setData('rank_type', e.target.value)}
                                    className={errors.rank_type ? 'border-red-500' : ''}
                                />
                                {errors.rank_type && (
                                    <p className="mt-1 text-sm text-red-500">{errors.rank_type}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    className={errors.label ? 'border-red-500' : ''}
                                    placeholder="Goals"
                                />
                                {errors.label && (
                                    <p className="mt-1 text-sm text-red-500">{errors.label}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="short">Short</option>
                                <option value="video">Video</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="detail_text">Detail</Label>
                            <Textarea
                                id="detail_text"
                                value={data.detail_text}
                                onChange={(e) => setData('detail_text', e.target.value)}
                                className={errors.detail_text ? 'border-red-500' : ''}
                                rows={4}
                            />
                            {errors.detail_text && (
                                <p className="mt-1 text-sm text-red-500">{errors.detail_text}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ✅ Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button type="submit" disabled={processing}>
                        {isEditing ? 'Update Item' : 'Create Item'}
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={route('videoItem.index', { video: videoId })}>Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
