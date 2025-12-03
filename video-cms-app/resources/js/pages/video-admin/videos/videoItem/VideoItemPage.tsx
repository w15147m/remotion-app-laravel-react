import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
import DeleteButton from '../../components/DeleteButton';
import CommonLayout from '../../layout/commonLayout';
import VideoItemsBulkUpload from '@/components/VideoItemsBulkUpload';
import { useEffect, useState } from 'react';

declare function route(name: string, parameters?: any): string;

interface VideoItem {
  id: number;
  sequence: number;
  image_url: string | null;
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
  type: string | null;
}

interface Video {
  id: number;
  title: string;
}

interface VideoItemPageProps {
  video: Video;
  video_items: VideoItem[];
}

export default function VideoItemPage({ video, video_items: initialItems }: VideoItemPageProps) {
  const [items, setItems] = useState<VideoItem[]>(initialItems);

  const pageInfo = {
    title: `Items for: ${video.title}`,
    btnText: 'New Item',
    url: route('videoItem.create', { video: video.id }),
  };

  // Handle bulk upload success
  const handleBulkUploadSuccess = () => {
    // Reload the page to refresh items
    window.location.reload();
  };

  // Handle inline image upload using temp-image system
  const handleImageUpload = async (itemId: number, file: File | undefined) => {
    if (!file) return;

    try {
      // Step 1: Upload to temp-image endpoint
      const formData = new FormData();
      formData.append('image', file);

      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

      const { default: axios } = await import('axios');
      const response = await axios.post('/temp-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': token || '',
        },
      });

      const { data: tempImageData } = response.data;

      // Step 2: Update the video item with the temp image
      const { router } = await import('@inertiajs/react');

      // Find the item to get all its data
      const item = items.find(i => i.id === itemId);
      if (!item) {
        alert('Item not found');
        return;
      }

      router.put(
        route('videoItem.update', { videoItem: itemId }),
        {
          video_id: video.id,
          gallery: {
            id: tempImageData.id,
            image_url: tempImageData.image_url,
            name: tempImageData.name,
          },
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            // Inertia will automatically update the page content from the redirect response
            console.log('Image updated successfully');
            window.location.reload();
          },
          onError: (errors) => {
            console.error('Update failed:', errors);
            alert('Failed to update image. Please try again.');
          },
        }
      );
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <CommonLayout pageInfo={pageInfo}>
      <Head title={`Items for: ${video.title}`} />

      {/* Bulk Upload Button - Added Here */}
      <div className="p-4">
        <VideoItemsBulkUpload
          videoId={video.id}
          onSuccess={handleBulkUploadSuccess}
        />
      </div>

      {/* Existing Table */}
      <div className="overflow-x-auto pt-2">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <th className="w-16 px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Seq.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Media
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Title / Subtitle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Icon
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Year / Range
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Rank
              </th>

              <th className="w-32 px-4 py-3 text-center text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900/50">
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {item.sequence}
                  </td>

                  <td className="px-4 py-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title || 'Preview'}
                        className="w-20 h-12 object-cover rounded-md border border-neutral-200 dark:border-neutral-700"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`image-upload-${item.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(item.id, e.target.files?.[0])}
                        />
                        <label
                          htmlFor={`image-upload-${item.id}`}
                          className="cursor-pointer px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          Upload Image
                        </label>
                      </div>
                    )}
                  </td>

                  {/* Title + Subtitle */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.title || 'Untitled'}
                    </div>
                    {item.subtitle && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.subtitle}
                      </div>
                    )}
                  </td>

                  {/* Icon */}
                  <td className="px-4 py-4 text-lg">
                    {item.icon || '—'}
                  </td>

                  {/* Country */}
                  <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {item.country || '—'}
                  </td>

                  {/* Year / Year Range */}
                  <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {item.year_range || item.year || '—'}
                  </td>

                  {/* Rank */}
                  <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {item.rank_number ? (
                      <>
                        #{item.rank_number}{' '}
                        <span className="text-xs text-neutral-400">({item.rank_label || item.label || 'N/A'})</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Edit/Delete */}
                  <td className="space-x-2 px-4 py-4 text-center whitespace-nowrap">
                    <Button asChild variant="outline" size="icon" title="Edit Item">
                      <Link
                        href={route('videoItem.edit', {
                          video: video.id,
                          videoItem: item.id,
                        })}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteButton route={`/videoItem/${item.id}`} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                >
                  This video has no items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CommonLayout>
  );
}
