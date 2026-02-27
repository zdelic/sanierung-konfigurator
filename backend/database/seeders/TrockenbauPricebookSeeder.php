<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class TrockenbauPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'trockenbau';
        $base = 148.18;

        $items = [];

        $add = function (
            string $positionKey,
            string $title,
            ?string $description,
            string $unit,
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

        // sort: 10,20,... kao u drugim gewerke
        $add('vorsatzschale', 'Vorsatzschale', null, 'm2', $base, 59.27, 10);
        $add('waende', 'Wände', null, 'm2', $base, 88.91, 20);
        $add('decke', 'Abgehängte Decke', null, 'm2', $base, 105.85, 30);
        $add('potterien', 'Potterien', null, 'm', $base, 169.35, 40);

        $add('akustik', 'Aufzahlung Akustik / Schallschutzanforderung', null, 'm2', $base, 63.51, 50);
        $add('brandschutz', 'Aufzahlung Brandschutzanforderung', null, 'm2', $base, 105.85, 60);
        $add('nassraum', 'Aufzahlung Nassraum', null, 'm2', $base, 5.92, 70);

        $add('revision_std', 'Aufzahlung Revision 30/30 oder 40/40', null, 'stk', $base, 95.26, 80);
        $add('revision_f90', 'Aufzahlung Revision 30/30 F90', null, 'stk', $base, 190.52, 90);

        $add('schottung', 'Schottung', null, 'stk', $base, 148.18, 100);
        $add('nicht_raumhoch', 'Aufzahlung nicht raumhoch / Überhöhen (UK)', null, 'stk', $base, 74.09, 110);
        $add('uk_kueche', 'UK Küche', null, 'lfm', $base, 31.75, 120);
        $add('umfassungszarge', 'Einbau Umfassungszarge Profil 42', null, 'stk', $base, 275.20, 130);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
