import React, { useState, useRef } from 'react';
import { Upload, Download, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AlertError from '@/components/ui/alert-error';

import axios from 'axios';
import * as XLSX from 'xlsx';

export default function VideoItemsBulkUpload({ videoId, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState('upload'); // upload, preview, result
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
      previewFile(selectedFile);
    }
  };

  // Parse Excel file on client-side
  const previewFile = async (selectedFile) => {
    setLoading(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert to JSON, starting from row 2 (skip header)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row and parse data
      const parsedData = [];
      const validationErrors = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];

        // Stop if row is empty
        if (!row || row.every(cell => !cell)) break;

        const item = {
          title: row[0] || null,
          subtitle: row[1] || null,
          heading: row[2] || null,
          icon: row[3] || null,
          country: row[4] || null,
          year: row[5] ? parseInt(row[5]) : null,
          year_range: row[6] || null,
          rank_number: row[7] ? parseInt(row[7]) : null,
          rank_type: row[8] || null,
          label: row[10] || null,
          detail_text: row[11] || null,
        };

        // Basic validation
        if (!item.title) {
          validationErrors.push(`Row ${i + 1}: Title is required`);
          continue;
        }

        parsedData.push(item);
      }

      setPreview(parsedData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
      }
      setStep('preview');
    } catch (error) {
      console.error('Parse error:', error);
      setErrors(['Error reading file: ' + error.message]);
    } finally {
      setLoading(false);
    }
  };

  // Send parsed data to backend
  const handleUpload = async () => {
    setLoading(true);

    try {
      const response = await axios.post('/video-items/bulk-import', {
        video_id: videoId,
        items: preview,
      });

      const data = response.data;
      setSuccess(data);
      setStep('result');
      setFile(null);
      setPreview([]);

      // Callback to parent to refresh list
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        setErrors(error.response.data.errors || [error.response.data.message || 'Upload failed']);
      } else {
        setErrors(['Upload failed: ' + error.message]);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type) => {
    const filename = type === 'footballers'
      ? 'video_items_template_footballers.xlsx'
      : 'video_items_template_empty.xlsx';

    const link = document.createElement('a');
    link.href = `/templates/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset form
  const resetForm = () => {
    setStep('upload');
    setFile(null);
    setPreview([]);
    setErrors([]);
    setSuccess(null);
    fileInputRef.current.value = '';
  };

  // Close modal
  const closeModal = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      {/* Button to open modal */}
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Bulk Upload
      </Button>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Bulk Upload Video Items
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Step */}
            {step === 'upload' && (
              <div className="space-y-4">
                {/* Template Download */}
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                    Download a template to see the correct format.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => downloadTemplate('empty')}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Empty Template
                    </Button>
                    <Button
                      onClick={() => downloadTemplate('footballers')}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Sample (Top 20 Footballers)
                    </Button>
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Excel (.xlsx, .xls) or CSV files only
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </div>

                {/* Selected File */}
                {file && (
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">{file.name}</span>
                    <button
                      onClick={() => {
                        setFile(null);
                        fileInputRef.current.value = '';
                      }}
                      disabled={loading}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="inline-block animate-spin mr-2">⏳</div>
                    Reading file...
                  </div>
                )}

                {/* Errors */}
                {errors.length > 0 && <AlertError errors={errors} />}
              </div>
            )}

            {/* Preview Step */}
            {step === 'preview' && (
              <div className="space-y-4">
                <h3 className="font-medium">Preview Data ({preview.length} items)</h3>

                {/* Preview Table */}
                <div className="overflow-x-auto max-h-80 overflow-y-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-2 py-2 text-left font-medium">Title</th>
                        <th className="px-2 py-2 text-left font-medium">Subtitle</th>
                        <th className="px-2 py-2 text-left font-medium">Icon</th>
                        <th className="px-2 py-2 text-left font-medium">Country</th>
                        <th className="px-2 py-2 text-left font-medium">Year</th>
                        <th className="px-2 py-2 text-left font-medium">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 15).map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="px-2 py-2 truncate max-w-[150px]" title={item.title}>{item.title}</td>
                          <td className="px-2 py-2 truncate max-w-[100px]" title={item.subtitle}>{item.subtitle || '—'}</td>
                          <td className="px-2 py-2">{item.icon || '—'}</td>
                          <td className="px-2 py-2">{item.country || '—'}</td>
                          <td className="px-2 py-2">{item.year || '—'}</td>
                          <td className="px-2 py-2">{item.rank_number || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {preview.length > 15 && (
                  <p className="text-xs text-gray-500">
                    ... and {preview.length - 15} more items
                  </p>
                )}

                {/* Errors from preview */}
                {errors.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                    <p className="text-xs text-yellow-900 dark:text-yellow-100 font-medium mb-2">
                      ⚠️ {errors.length} validation issue(s):
                    </p>
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {errors.slice(0, 5).map((err, idx) => (
                        <p key={idx} className="text-yellow-800 dark:text-yellow-200">{err}</p>
                      ))}
                      {errors.length > 5 && (
                        <p className="text-yellow-800 dark:text-yellow-200">... and {errors.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    onClick={() => closeModal()}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    size="sm"
                    disabled={loading || preview.length === 0}
                  >
                    {loading ? 'Uploading...' : `Upload ${preview.length}`}
                  </Button>
                </div>
              </div>
            )}

            {/* Result Step */}
            {step === 'result' && success && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-green-900 dark:text-green-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <strong>{success.created}</strong> items created successfully
                  </p>
                  {success.skipped > 0 && (
                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                      ⚠️ <strong>{success.skipped}</strong> items skipped
                    </p>
                  )}
                </div>

                <Button onClick={closeModal} className="w-full" size="sm">
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
