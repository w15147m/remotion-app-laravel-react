<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\VideoItem;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class BulkImportVideoItemController extends Controller
{
    /**
     * Preview Excel file before importing
     * POST /api/video-items/preview
     */
    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'video_id' => 'required|exists:videos,id',
        ]);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();

            $rows = [];
            $errors = [];
            $rowNumber = 2; // Start from row 2 (skip header)

            // Get all rows
            foreach ($worksheet->getRowIterator(2) as $row) {
                $cellIterator = $row->getCellIterator('A', 'G');
                $cellIterator->setIterateOnlyExistingCells(false);

                $data = [];
                $cells = iterator_to_array($cellIterator);

                // Map columns: A=title, B=heading, C=year, D=rank_number, E=rank_type, F=detail_text, G=country
                $data['title'] = $cells['A']?->getValue() ?? null;
                $data['heading'] = $cells['B']?->getValue() ?? null;
                $data['year'] = $cells['C']?->getValue() ?? null;
                $data['rank_number'] = $cells['D']?->getValue() ?? null;
                $data['rank_type'] = $cells['E']?->getValue() ?? null;
                $data['detail_text'] = $cells['F']?->getValue() ?? null;
                $data['country'] = $cells['G']?->getValue() ?? null;

                // Stop if all cells are empty
                if (!$data['title'] && !$data['heading'] && !$data['year'] && !$data['rank_number']) {
                    break;
                }

                // Basic validation
                $validation = $this->validateRow($data, $rowNumber);

                if ($validation['valid']) {
                    $rows[] = $data;
                } else {
                    $errors[] = "Row {$rowNumber}: " . implode(', ', $validation['errors']);
                }

                $rowNumber++;
            }

            return response()->json([
                'data' => $rows,
                'errors' => $errors,
                'total_rows' => count($rows),
                'total_errors' => count($errors),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error reading file: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Import Excel data into database
     * POST /api/video-items/bulk-import
     */
    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'video_id' => 'required|exists:videos,id',
        ]);

        try {
            $videoId = $request->video_id;
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();

            $created = 0;
            $skipped = 0;
            $errors = [];

            // Get the highest sequence number for this video
            $maxSequence = VideoItem::where('video_id', $videoId)->max('sequence') ?? 0;
            $nextSequence = $maxSequence + 1;

            $rowNumber = 2;

            // Process each row
            foreach ($worksheet->getRowIterator(2) as $row) {
                $cellIterator = $row->getCellIterator('A', 'G');
                $cellIterator->setIterateOnlyExistingCells(false);

                $data = [];
                $cells = iterator_to_array($cellIterator);

                // Map columns
                $data['title'] = $cells['A']?->getValue() ?? null;
                $data['heading'] = $cells['B']?->getValue() ?? null;
                $data['year'] = $cells['C']?->getValue() ?? null;
                $data['rank_number'] = $cells['D']?->getValue() ?? null;
                $data['rank_type'] = $cells['E']?->getValue() ?? null;
                $data['detail_text'] = $cells['F']?->getValue() ?? null;
                $data['country'] = $cells['G']?->getValue() ?? null;

                // Stop if all cells are empty
                if (!$data['title'] && !$data['heading'] && !$data['year'] && !$data['rank_number']) {
                    break;
                }

                // Validate row
                $validation = $this->validateRow($data, $rowNumber);

                if (!$validation['valid']) {
                    $skipped++;
                    $errors[] = "Row {$rowNumber}: " . implode(', ', $validation['errors']);
                    $rowNumber++;
                    continue;
                }

                // Prepare data for insertion
                $itemData = [
                    'video_id' => $videoId,
                    'sequence' => $nextSequence,
                    'title' => $data['title'],
                    'heading' => $data['heading'] ?? null,
                    'year' => $data['year'] ? (int)$data['year'] : null,
                    'rank_number' => $data['rank_number'] ? (int)$data['rank_number'] : null,
                    'rank_type' => $data['rank_type'] ?? null,
                    'detail_text' => $data['detail_text'] ?? null,
                    'country' => $data['country'] ?? null,
                    'media_url' => null, // Skip images for now
                ];

                // Create the video item
                try {
                    VideoItem::create($itemData);
                    $created++;
                    $nextSequence++;
                } catch (\Exception $e) {
                    $skipped++;
                    $errors[] = "Row {$rowNumber}: Failed to create - " . $e->getMessage();
                }

                $rowNumber++;
            }

            return response()->json([
                'created' => $created,
                'skipped' => $skipped,
                'errors' => $errors,
                'message' => "{$created} items imported successfully. {$skipped} items skipped.",
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Download Excel template
     * GET /api/video-items/template
     */
  /**
     * Download Excel template
     * GET /api/video-items/template
     */
    public function downloadTemplate()
    {
        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Video Items');

            // Set headers in row 1 - SIMPLE VERSION
            $sheet->setCellValue('A1', 'Title');
            $sheet->setCellValue('B1', 'Heading');
            $sheet->setCellValue('C1', 'Year');
            $sheet->setCellValue('D1', 'Rank Number');
            $sheet->setCellValue('E1', 'Rank Type');
            $sheet->setCellValue('F1', 'Detail Text');
            $sheet->setCellValue('G1', 'Country');

            // Add sample data in row 2
            $sheet->setCellValue('A2', 'Titanic');
            $sheet->setCellValue('B2', 'Greatest Ship');
            $sheet->setCellValue('C2', 1997);
            $sheet->setCellValue('D2', 1);
            $sheet->setCellValue('E2', 'Movie');
            $sheet->setCellValue('F2', 'Sank in 1912');
            $sheet->setCellValue('G2', 'USA');

            // Make header row BOLD (no colors, just bold)
            $sheet->getStyle('A1:G1')->getFont()->setBold(true);
            $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal('center');

            // Set column widths
            $sheet->getColumnDimension('A')->setWidth(25);
            $sheet->getColumnDimension('B')->setWidth(20);
            $sheet->getColumnDimension('C')->setWidth(10);
            $sheet->getColumnDimension('D')->setWidth(15);
            $sheet->getColumnDimension('E')->setWidth(15);
            $sheet->getColumnDimension('F')->setWidth(30);
            $sheet->getColumnDimension('G')->setWidth(15);

            // Create writer
            $writer = new Xlsx($spreadsheet);

            // Set headers for download
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment; filename="video_items_template.xlsx"');
            header('Cache-Control: max-age=0');
            header('Pragma: public');
            header('Expires: 0');

            // Output file
            $writer->save('php://output');
            exit;

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating template: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Validate a single row
     */
    private function validateRow($data, $rowNumber)
    {
        $errors = [];

        // Title is required
        if (empty($data['title'])) {
            $errors[] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $errors[] = 'Title must be max 255 characters';
        }

        // Heading is optional but max 255
        if (!empty($data['heading']) && strlen($data['heading']) > 255) {
            $errors[] = 'Heading must be max 255 characters';
        }

        // Year validation
        if (!empty($data['year'])) {
            $year = (int)$data['year'];
            if ($year < 1900 || $year > 2100) {
                $errors[] = 'Year must be between 1900 and 2100';
            }
        }

        // Rank number should be numeric
        if (!empty($data['rank_number']) && !is_numeric($data['rank_number'])) {
            $errors[] = 'Rank Number must be numeric';
        }

        // Rank type max 50
        if (!empty($data['rank_type']) && strlen($data['rank_type']) > 50) {
            $errors[] = 'Rank Type must be max 50 characters';
        }

        // Detail text is optional
        if (!empty($data['detail_text']) && strlen($data['detail_text']) > 5000) {
            $errors[] = 'Detail Text is too long';
        }

        // Country max 100
        if (!empty($data['country']) && strlen($data['country']) > 100) {
            $errors[] = 'Country must be max 100 characters';
        }

        return [
            'valid' => count($errors) === 0,
            'errors' => $errors,
        ];
    }
}
