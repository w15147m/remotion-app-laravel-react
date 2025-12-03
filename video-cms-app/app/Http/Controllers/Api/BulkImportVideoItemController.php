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
                $cellIterator = $row->getCellIterator('A', 'L');
                $cellIterator->setIterateOnlyExistingCells(false);

                $data = [];
                $cells = iterator_to_array($cellIterator);

                // Map columns: A=title, B=subtitle, C=heading, D=icon, E=country, F=year, G=year_range, H=rank_number, I=rank_type, J=rank_label, K=label, L=detail_text
                $data['title'] = $cells['A']?->getValue() ?? null;
                $data['subtitle'] = $cells['B']?->getValue() ?? null;
                $data['heading'] = $cells['C']?->getValue() ?? null;
                $data['icon'] = $cells['D']?->getValue() ?? null;
                $data['country'] = $cells['E']?->getValue() ?? null;
                $data['year'] = $cells['F']?->getValue() ?? null;
                $data['year_range'] = $cells['G']?->getValue() ?? null;
                $data['rank_number'] = $cells['H']?->getValue() ?? null;
                $data['rank_type'] = $cells['I']?->getValue() ?? null;
                $data['rank_label'] = $cells['J']?->getValue() ?? null;
                $data['label'] = $cells['K']?->getValue() ?? null;
                $data['detail_text'] = $cells['L']?->getValue() ?? null;

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
     * Import JSON data into database
     * POST /video-items/bulk-import
     */
    public function bulkImport(Request $request)
    {
        $request->validate([
            'video_id' => 'required|exists:videos,id',
            'items' => 'required|array',
            'items.*.title' => 'required|string|max:255',
            'items.*.subtitle' => 'nullable|string|max:255',
            'items.*.heading' => 'nullable|string|max:255',
            'items.*.icon' => 'nullable|string|max:10',
            'items.*.country' => 'nullable|string|max:100',
            'items.*.year' => 'nullable|integer|min:1900|max:2100',
            'items.*.year_range' => 'nullable|string|max:50',
            'items.*.rank_number' => 'nullable|integer',
            'items.*.rank_type' => 'nullable|string|max:50',
            'items.*.rank_label' => 'nullable|string|max:100',
            'items.*.label' => 'nullable|string|max:100',
            'items.*.detail_text' => 'nullable|string|max:5000',
        ]);

        try {
            $videoId = $request->video_id;
            $items = $request->items;

            // Get the highest sequence number for this video
            $maxSequence = VideoItem::where('video_id', $videoId)->max('sequence') ?? 0;
            $nextSequence = $maxSequence + 1;

            $created = 0;
            $skipped = 0;
            $errors = [];

            // Process each item
            foreach ($items as $index => $data) {
                // Prepare data for insertion
                $itemData = [
                    'video_id' => $videoId,
                    'sequence' => $nextSequence,
                    'title' => $data['title'],
                    'subtitle' => $data['subtitle'] ?? null,
                    'heading' => $data['heading'] ?? null,
                    'icon' => $data['icon'] ?? null,
                    'country' => $data['country'] ?? null,
                    'year' => $data['year'] ?? null,
                    'year_range' => $data['year_range'] ?? null,
                    'rank_number' => $data['rank_number'] ?? null,
                    'rank_type' => $data['rank_type'] ?? null,
                    'rank_label' => $data['rank_label'] ?? null,
                    'label' => $data['label'] ?? null,
                    'detail_text' => $data['detail_text'] ?? null,
                    'media_url' => null, // Skip images for now
                ];

                // Create the video item
                try {
                    VideoItem::create($itemData);
                    $created++;
                    $nextSequence++;
                } catch (\Exception $e) {
                    $skipped++;
                    $errors[] = "Item " . ($index + 1) . ": Failed to create - " . $e->getMessage();
                }
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

            // Set headers in row 1
            $sheet->setCellValue('A1', 'Title');
            $sheet->setCellValue('B1', 'Subtitle');
            $sheet->setCellValue('C1', 'Heading');
            $sheet->setCellValue('D1', 'Icon/Emoji');
            $sheet->setCellValue('E1', 'Country');
            $sheet->setCellValue('F1', 'Year');
            $sheet->setCellValue('G1', 'Year Range');
            $sheet->setCellValue('H1', 'Rank Number');
            $sheet->setCellValue('I1', 'Rank Type');
            $sheet->setCellValue('J1', 'Rank Label');
            $sheet->setCellValue('K1', 'Label');
            $sheet->setCellValue('L1', 'Detail Text');

            // Add sample data in row 2
            $sheet->setCellValue('A2', 'Cristiano Ronaldo');
            $sheet->setCellValue('B2', 'Portugal');
            $sheet->setCellValue('C2', 'The GOAT');
            $sheet->setCellValue('D2', '⚽');
            $sheet->setCellValue('E2', 'Portugal');
            $sheet->setCellValue('F2', 2002);
            $sheet->setCellValue('G2', '2002-Present');
            $sheet->setCellValue('H2', 1);
            $sheet->setCellValue('I2', 'Goals');
            $sheet->setCellValue('J2', 'Goals');
            $sheet->setCellValue('K2', 'Goals');
            $sheet->setCellValue('L2', 'Top scorer of all time');

            // Make header row BOLD
            $sheet->getStyle('A1:L1')->getFont()->setBold(true);
            $sheet->getStyle('A1:L1')->getAlignment()->setHorizontal('center');

            // Set column widths
            $sheet->getColumnDimension('A')->setWidth(25);
            $sheet->getColumnDimension('B')->setWidth(20);
            $sheet->getColumnDimension('C')->setWidth(20);
            $sheet->getColumnDimension('D')->setWidth(12);
            $sheet->getColumnDimension('E')->setWidth(15);
            $sheet->getColumnDimension('F')->setWidth(10);
            $sheet->getColumnDimension('G')->setWidth(15);
            $sheet->getColumnDimension('H')->setWidth(15);
            $sheet->getColumnDimension('I')->setWidth(15);
            $sheet->getColumnDimension('J')->setWidth(15);
            $sheet->getColumnDimension('K')->setWidth(15);
            $sheet->getColumnDimension('L')->setWidth(30);

            // Create writer and save to stream
            $writer = new Xlsx($spreadsheet);
            
            return response()->streamDownload(function() use ($writer) {
                $writer->save('php://output');
            }, 'video_items_template.xlsx', [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);

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

        // Subtitle max 255
        if (!empty($data['subtitle']) && strlen($data['subtitle']) > 255) {
            $errors[] = 'Subtitle must be max 255 characters';
        }

        // Icon max 10
        if (!empty($data['icon']) && strlen($data['icon']) > 10) {
            $errors[] = 'Icon must be max 10 characters';
        }

        // Year Range max 50
        if (!empty($data['year_range']) && strlen($data['year_range']) > 50) {
            $errors[] = 'Year Range must be max 50 characters';
        }

        // Rank number should be numeric
        if (!empty($data['rank_number']) && !is_numeric($data['rank_number'])) {
            $errors[] = 'Rank Number must be numeric';
        }

        // Rank type max 50
        if (!empty($data['rank_type']) && strlen($data['rank_type']) > 50) {
            $errors[] = 'Rank Type must be max 50 characters';
        }

        // Rank label max 100
        if (!empty($data['rank_label']) && strlen($data['rank_label']) > 100) {
            $errors[] = 'Rank Label must be max 100 characters';
        }

        // Label max 100
        if (!empty($data['label']) && strlen($data['label']) > 100) {
            $errors[] = 'Label must be max 100 characters';
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
