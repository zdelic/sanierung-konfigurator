<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class BMSTPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'bmst';
        $items = [];

        $add = function (
            string $positionKey,
            string $title,
            ?string $description,
            ?string $unit,
            float $grundpreis,
            float $unitprice,
            int $sort
        ) use (&$items, $g) {
            $items[] = [
                'gewerk_key' => $g,
                'position_key' => $positionKey,
                'title' => $title,
                'description' => $description,
                'unit' => $unit,
                'grundpreis' => $grundpreis,
                'unitprice' => $unitprice,
                'is_active' => true,
                'sort' => $sort,
            ];
        };

        // 1) Türdurchbruch (tragend)
        $add(
            'tuerdurchbruch_tragend',
            'Türdurchbruch (tragend) bis 100/220cm',
            'Türdurchbruch (tragend) bis 100/220cm – samt Überlage und Leibungsherstellung',
            'Stk',
            0.00,
            644.27,
            10
        );

        // 2) Auswechslung bis 20cm
        $add(
            'auswechslung20',
            'Auswechslung in tragender Wand bis 20cm',
            'bis HEA 180 inkl. Auflager, kraftschlüssiges vermörteln sowie verputzen der Leibungen',
            'lfm',
            736.32,
            723.06,
            20
        );

        // 3) Auswechslung bis 40cm
        $add(
            'auswechslung40',
            'Auswechslung in tragender Wand bis 40cm',
            'bis HEA 180 inkl. Auflager, kraftschlüssiges vermörteln sowie verputzen der Leibungen',
            'lfm',
            1104.47,
            1799.55,
            30
        );

        // 4) Einreichung + Statik (obavezno kod Auswechslung) – zajednička stavka
        $add(
            'auswechslung_statik_fee',
            'Einreichung + Statische Berechnung',
            'Verpflichtend bei Auswechslung (zusätzliche Kosten).',
            'Pauschal',
            2194.20,
            0.00,
            35
        );

        // 5) MWK nicht tragend
        $add(
            'mwk_nicht_tragend',
            'MWK (inkl. Verputz) nicht tragend',
            'MWK (inkl. Verputz) nicht tragend',
            'm²',
            165.66,
            254.03,
            40
        );

        // 6) MWK tragend
        $add(
            'mwk_tragend',
            'Tragendes MWK (inkl. Verputz)',
            'Tragendes MWK (inkl. Verputz)',
            'm²',
            165.66,
            298.20,
            50
        );

        // 7) Ausmauerung NF
        $add(
            'ausmauerung_nf',
            'Ausmauerungen mit NF Ziegel (inkl. Verputz)',
            'Ausmauerungen mit NF Ziegel (inkl. Verputz)',
            'm³',
            248.50,
            1347.46,
            60
        );

        // 8) Kamin herstellen
        $add(
            'kamin_herstellen',
            'Kamin herstellen',
            'Kamin herstellen',
            'm³',
            331.35,
            294.09,
            70
        );

        // 9) Aufzahlung Türchen
        $add(
            'aufz_tuerchen',
            'Aufzahlung Türchen',
            'Aufzahlung Türchen',
            'Stk',
            0.00,
            128.86,
            80
        );

        // upsert po (gewerk_key, position_key)
        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
