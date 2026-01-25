import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
import DeleteButton from '../../components/DeleteButton';
import CommonLayout from '../../layout/commonLayout';
import VideoItemsBulkUpload from '@/components/VideoItemsBulkUpload';
import { InlineImageUpload } from '@/components/InlineImageUpload';
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
console.log('====================================');
console.log('Items:', items);
console.log('====================================');
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
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Title / Sub
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
                    <InlineImageUpload
                      itemId={item.id}
                      videoId={video.id}
                      currentImageUrl={item.image_url}
                    />
                  </td>

                  {/* Title + Subtitle */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.title || 'Untitled')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                        title="Search on Google"
                      >
                        {item.title || 'Untitled'}
                      </a>
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
                        <span className="text-xs text-neutral-400">({item.rank_type || item.label || 'N/A'})</span>
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
