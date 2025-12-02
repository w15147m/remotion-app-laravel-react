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
  heading: string | null;
  year: number | null;
  rank_number: number | null;
  rank_type: string | null;
  detail_text: string | null;
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
                Title / Heading
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Detail
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
                      <span className="text-xs text-neutral-400">No image</span>
                    )}
                  </td>

                  {/* Title + Heading */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.title || 'Untitled'}
                    </div>
                    {item.heading && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.heading}
                      </div>
                    )}
                  </td>

                  {/* Year */}
                  <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {item.year || '—'}
                  </td>

                  {/* Rank */}
                  <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {item.rank_number ? (
                      <>
                        #{item.rank_number}{' '}
                        <span className="text-xs text-neutral-400">({item.rank_type || 'N/A'})</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Detail Text */}
                  <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300 max-w-sm truncate">
                    {item.detail_text || '—'}
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
