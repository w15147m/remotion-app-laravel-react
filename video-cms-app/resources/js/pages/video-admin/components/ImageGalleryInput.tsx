import axios from "axios"; // in ImageGalleryInput.tsx
import { Trash2, Upload } from 'lucide-react';
import React, { useState, DragEvent, ClipboardEvent, useCallback } from 'react';

interface ImageData {
    id: number;
    image_url: string;
    name: string;
}

interface ImageGalleryInputProps {
    initialGalleryImages?: ImageData[];
    onGalleryChange: (images: ImageData[]) => void;
    isEditing?: boolean;
    isSingle?: boolean;
}

const ImageGalleryInput: React.FC<ImageGalleryInputProps> = ({
    initialGalleryImages = [],
    onGalleryChange,
    isSingle = false,
}) => {
    const [isLoader, setLoader] = useState(false);
    const [isDragOver, setDragOver] = useState(false); // New state for drag-over visual feedback
    const [galleryImages, setGalleryImages] =
        useState<ImageData[]>(initialGalleryImages);

    // Reusable function to process and upload a file
    const uploadFile = useCallback(async (file: File) => {
        setLoader(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await axios.post('/temp-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': token || '',
                },
            });

            const { data } = response.data;

            const imageObj: ImageData = {
                id: data.id,
                image_url: data.image_url,
                name: data.name,
            };

            const updatedImages = isSingle
                ? [imageObj]
                : [...galleryImages, imageObj];

            setGalleryImages(updatedImages);
            onGalleryChange(updatedImages);
        } catch (error: any) {
            console.error(
                'Upload Error:',
                error.response?.data || error.message,
            );
        } finally {
            setLoader(false);
        }
    }, [galleryImages, isSingle, onGalleryChange]); // Include dependencies

    // Handles files from <input type="file">
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
        // Reset the input value so the same file can be selected again
        e.target.value = '';
    };

    // Handles files from Drag & Drop or Paste
    const handleDroppedOrPastedFile = (file: File | undefined) => {
        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        // Check if upload is disabled (e.g., in single mode and image already exists)
        if (isSingle && galleryImages.length >= 1) {
            console.warn('Cannot upload more than one image in single mode.');
            return;
        }

        uploadFile(file);
    };

    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Essential to allow a drop
        if (!isLoader && !disableUpload) {
            setDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        if (isLoader || disableUpload) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            // Process the first dropped file (for simplicity)
            handleDroppedOrPastedFile(droppedFiles[0]);
        }
    };

    // --- Paste Handler ---
    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        if (isLoader || disableUpload) return;

        // Use timeout to let the browser process the event before calling uploadFile
        setTimeout(() => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        handleDroppedOrPastedFile(file);
                        // Stop after finding the first image
                        break;
                    }
                }
            }
        }, 0);
    };

    const handleTrash = (imageId: number) => {
        const filteredImages = galleryImages.filter(
            (img) => img.id !== imageId,
        );
        setGalleryImages(filteredImages);
        onGalleryChange(filteredImages);
    };

    const disableUpload = isSingle && galleryImages.length >= 1;
    const isInteracting = isLoader || disableUpload || isDragOver;

    return (
        // Add onPaste handler to the main container or document if you want global paste
        <div className="mb-6" onPaste={handlePaste}>
            <div className="flex w-full flex-wrap gap-4">
                {!disableUpload && (
                    <div className="h-48 w-44">
                        <label
                            className={`custom-file-upload block h-full ${
                                disableUpload
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                            }`}
                        >
                            <div
                                // Add Drag & Drop handlers and dynamic classes to the dropzone
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                                    isLoader
                                        ? 'border-gray-300 bg-gray-100' // Loader style
                                        : isDragOver
                                          ? 'border-primary-500 bg-primary-50' // Drag Over style
                                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100' // Normal style
                                }`}
                            >
                                {isLoader ? (
                                    <div className="flex flex-col items-center p-4">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Uploading...
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center p-4 text-gray-600">
                                        {!disableUpload && <Upload></Upload>}
                                        <div className="mt-1 text-center text-sm">
                                            {isDragOver
                                                ? 'Drop the image here' // Drag over text
                                                : disableUpload
                                                  ? 'only one image can upload'
                                                  : 'Click, Drag & Drop, or Paste image'} {/* Updated normal text */}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                className="sr-only"
                                onChange={handleFileInputChange} // Renamed handler
                                accept="image/*"
                                disabled={isInteracting}
                            />
                        </label>
                    </div>
                )}

                {galleryImages.map((image) => (
                    <div
                        key={image.id}
                        className="relative h-48 w-44 overflow-hidden rounded-lg border border-gray-200 shadow-md"
                    >
                        <img
                            src={image.image_url}
                            alt={image.name}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-80 transition-opacity hover:opacity-100"
                            onClick={() => handleTrash(image.id)}
                            aria-label="Delete image"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGalleryInput;
