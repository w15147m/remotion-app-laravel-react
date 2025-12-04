<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RegenerateTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:regenerate-templates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate static Excel templates for video items';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $headers = [
            'Title', 'Subtitle', 'Heading', 'Icon/Emoji', 'Country', 'Year', 'Year Range',
            'Rank Number', 'Rank Type', 'Label', 'Detail Text'
        ];

        $footballersData = [
            [
                'Cristiano Ronaldo', 'Portugal', 'The GOAT', '⚽', 'Portugal', 2002, '2002-Present',
                1, 'Goals', 'Goals', 'Top scorer of all time'
            ]
        ];

        $generateFile = function ($filename, $data = []) use ($headers) {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Video Items');

            // Set headers
            foreach ($headers as $index => $header) {
                $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
                $sheet->setCellValue($column . '1', $header);
                $sheet->getColumnDimension($column)->setAutoSize(true);
            }
            $sheet->getStyle('A1:K1')->getFont()->setBold(true);

            // Set data
            $row = 2;
            foreach ($data as $item) {
                foreach ($item as $index => $value) {
                    $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
                    $sheet->setCellValue($column . $row, $value);
                }
                $row++;
            }

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $path = public_path('templates/' . $filename);
            
            // Ensure directory exists
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            $writer->save($path);
            $this->info("Generated {$filename}");
        };

        $this->info('Regenerating templates...');
        
        $generateFile('video_items_template.xlsx', $footballersData);
        $generateFile('video_items_template_footballers.xlsx', $footballersData);
        $generateFile('video_items_template_empty.xlsx', []);

        $this->info('All templates regenerated successfully!');
    }
}
