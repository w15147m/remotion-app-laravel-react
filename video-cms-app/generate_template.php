<?php

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$spreadsheet = new Spreadsheet();
// Function to set headers and formatting
function setupSheet($sheet) {
    $sheet->setTitle('Video Items');
    
    $headers = [
        'A1' => 'Title', 'B1' => 'Subtitle', 'C1' => 'Heading', 
        'D1' => 'Icon/Emoji', 'E1' => 'Country', 'F1' => 'Year', 
        'G1' => 'Year Range', 'H1' => 'Rank Number', 'I1' => 'Rank Type', 
        'J1' => 'Rank Label', 'K1' => 'Label', 'L1' => 'Detail Text'
    ];

    foreach ($headers as $cell => $value) {
        $sheet->setCellValue($cell, $value);
    }

    // Make header row BOLD
    $sheet->getStyle('A1:L1')->getFont()->setBold(true);
    $sheet->getStyle('A1:L1')->getAlignment()->setHorizontal('center');

    // Set column widths
    $widths = [
        'A' => 25, 'B' => 20, 'C' => 20, 'D' => 12, 'E' => 15, 
        'F' => 10, 'G' => 15, 'H' => 15, 'I' => 15, 'J' => 15, 
        'K' => 15, 'L' => 30
    ];

    foreach ($widths as $col => $width) {
        $sheet->getColumnDimension($col)->setWidth($width);
    }
}

// 1. Generate Empty Template
$spreadsheetEmpty = new Spreadsheet();
setupSheet($spreadsheetEmpty->getActiveSheet());
$writerEmpty = new Xlsx($spreadsheetEmpty);
$pathEmpty = __DIR__ . '/public/templates/video_items_template_empty.xlsx';
$writerEmpty->save($pathEmpty);
echo "Empty template generated at: $pathEmpty\n";

// 2. Generate Populated Template (Top 20 Footballers)
$spreadsheetPopulated = new Spreadsheet();
$sheetPop = $spreadsheetPopulated->getActiveSheet();
setupSheet($sheetPop);

$footballers = [
    ['Cristiano Ronaldo', 'Portugal', 'The GOAT', '🇵🇹', 'Portugal', 2024, '2002-Present', 873, 'Goals', 'Goals', 'Goals', 'All-time top scorer'],
    ['Lionel Messi', 'Argentina', 'La Pulga', '🇦🇷', 'Argentina', 2024, '2004-Present', 821, 'Goals', 'Goals', 'Goals', 'Most Ballon d\'Or winner'],
    ['Pelé', 'Brazil', 'The King', '🇧🇷', 'Brazil', 1977, '1956-1977', 762, 'Goals', 'Goals', 'Goals', 'Three-time World Cup winner'],
    ['Romário', 'Brazil', 'Baixinho', '🇧🇷', 'Brazil', 2009, '1985-2009', 755, 'Goals', 'Goals', 'Goals', 'Clinical finisher'],
    ['Ferenc Puskás', 'Hungary', 'The Galloping Major', '🇭🇺', 'Hungary', 1966, '1943-1966', 724, 'Goals', 'Goals', 'Goals', 'Legendary Hungarian striker'],
    ['Josef Bican', 'Austria', 'Pepi', '🇦🇹', 'Austria', 1955, '1931-1955', 722, 'Goals', 'Goals', 'Goals', 'Prolific goalscorer'],
    ['Jimmy Jones', 'Northern Ireland', 'Jonesy', '🇬🇧', 'N. Ireland', 1964, '1946-1965', 648, 'Goals', 'Goals', 'Goals', 'Irish league legend'],
    ['Gerd Müller', 'Germany', 'Der Bomber', '🇩🇪', 'Germany', 1981, '1963-1981', 634, 'Goals', 'Goals', 'Goals', 'Bayern Munich legend'],
    ['Eusébio', 'Portugal', 'Black Panther', '🇵🇹', 'Portugal', 1979, '1957-1979', 619, 'Goals', 'Goals', 'Goals', 'Benfica legend'],
    ['Joe Bambrick', 'Northern Ireland', 'Bambrick', '🇬🇧', 'N. Ireland', 1939, '1926-1939', 616, 'Goals', 'Goals', 'Goals', 'Former world record holder'],
    ['Robert Lewandowski', 'Poland', 'Lewy', '🇵🇱', 'Poland', 2024, '2008-Present', 610, 'Goals', 'Goals', 'Goals', 'Bundesliga record breaker'],
    ['Zlatan Ibrahimović', 'Sweden', 'Ibra', '🇸🇪', 'Sweden', 2023, '1999-2023', 573, 'Goals', 'Goals', 'Goals', 'Scored in 4 decades'],
    ['Luis Suárez', 'Uruguay', 'El Pistolero', '🇺🇾', 'Uruguay', 2024, '2005-Present', 557, 'Goals', 'Goals', 'Goals', 'Uruguay top scorer'],
    ['Ferenc Deák', 'Hungary', 'Bamba', '🇭🇺', 'Hungary', 1957, '1940-1957', 558, 'Goals', 'Goals', 'Goals', 'Hungarian league legend'],
    ['Uwe Seeler', 'Germany', 'Uns Uwe', '🇩🇪', 'Germany', 1972, '1953-1972', 551, 'Goals', 'Goals', 'Goals', 'Hamburg legend'],
    ['Túlio Maravilha', 'Brazil', 'Túlio', '🇧🇷', 'Brazil', 2019, '1988-2019', 545, 'Goals', 'Goals', 'Goals', 'Self-proclaimed 1000 goals'],
    ['Arthur Friedenreich', 'Brazil', 'El Tigre', '🇧🇷', 'Brazil', 1935, '1909-1935', 554, 'Goals', 'Goals', 'Goals', 'First Brazilian star'],
    ['Ali Daei', 'Iran', 'Shariar', '🇮🇷', 'Iran', 2007, '1988-2007', 503, 'Goals', 'Goals', 'Goals', 'Former international record holder'],
    ['Godfrey Chitalu', 'Zambia', 'Ucar', '🇿🇲', 'Zambia', 1982, '1964-1982', 500, 'Goals', 'Goals', 'Goals', 'Zambian legend'],
    ['Gyula Zsengellér', 'Hungary', 'Professor', '🇭🇺', 'Hungary', 1952, '1935-1952', 490, 'Goals', 'Goals', 'Goals', 'World Cup finalist']
];

$row = 2;
foreach ($footballers as $player) {
    $col = 'A';
    foreach ($player as $value) {
        $sheetPop->setCellValue($col . $row, $value);
        $col++;
    }
    $row++;
}

$writerPop = new Xlsx($spreadsheetPopulated);
$pathPop = __DIR__ . '/public/templates/video_items_template_footballers.xlsx';
$writerPop->save($pathPop);
echo "Populated template generated at: $pathPop\n";
