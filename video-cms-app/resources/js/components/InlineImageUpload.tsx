import React from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

declare function route(name: string, parameters?: any): string;

interface InlineImageUploadProps {
  itemId: number;
  videoId: number;
  currentImageUrl?: string | null;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

export const InlineImageUpload: React.FC<InlineImageUploadProps> = ({
  itemId,
  videoId,
  currentImageUrl,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageUpload = async (file: File | null | undefined) => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload to temp-image endpoint
      const formData = new FormData();
      formData.append('image', file);

      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await axios.post('/temp-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': token || '',
        },
      });

      const { data: tempImageData } = response.data;

      // Step 2: Update the video item with the temp image
      router.put(
        route('videoItem.update', { videoItem: itemId }),
        {
          video_id: videoId,
          gallery: {
            id: tempImageData.id,
            image_url: tempImageData.image_url,
            name: tempImageData.name,
          },
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            console.log('Image updated successfully');
            setIsUploading(false);
            if (onUploadSuccess) {
              onUploadSuccess();
            }
            window.location.reload();
          },
          onError: (errors) => {
            console.error('Update failed:', errors);
            setIsUploading(false);
            const errorMessage = 'Failed to update image. Please try again.';
            if (onUploadError) {
              onUploadError(errorMessage);
            } else {
              alert(errorMessage);
            }
          },
        }
      );
    } catch (error: any) {
      console.error('Upload error:', error);
      setIsUploading(false);
      const errorMessage = 'Failed to upload image: ' + (error.response?.data?.message || error.message);
      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {currentImageUrl && (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Item"
            className="h-16 w-16 rounded-lg object-cover border-2 border-neutral-200 dark:border-neutral-700 shadow-sm"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <input
          type="file"
          id={`image-upload-${itemId}`}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${itemId}`}
          className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${isUploading
              ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
              : currentImageUrl
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md cursor-pointer'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md cursor-pointer'
            }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : currentImageUrl ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Change Image
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Image
            </>
          )}
        </label>
      </div>
    </div>
  );
};
