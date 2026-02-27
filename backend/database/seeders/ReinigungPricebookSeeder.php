<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class ReinigungPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $gewerk = 'reinigung';

        $rows = [
            // meta
            [
                'gewerk_key' => $gewerk,
                'position_key' => 'meta',
                'title' => 'Reinigung',
                'description' => 'Räumung, Entsorgung & Endreinigung',
                'unit' => null,
                'grundpreis' => 0,
                'unitprice' => 0,
                'is_active' => true,
                'sort' => 1,
            ],

            // Räumen normal (range pauschal)
            ['position_key' => 'raeumen_normal.ranges.0_40',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => "Entrümpeln, räumen der Bestandswohnung vor Beginn der Umbauarbeiten inkl. sach- und fachgerechter Entsorgung.\nPauschalpreis gilt für eine normal verunreinigte Wohnung.", 'unit' => 'pauschal', 'grundpreis' => 963.01,  'unitprice' => 0, 'sort' => 10],
            ['position_key' => 'raeumen_normal.ranges.41_50',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1133.67, 'unitprice' => 0, 'sort' => 11],
            ['position_key' => 'raeumen_normal.ranges.51_60',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1303.11, 'unitprice' => 0, 'sort' => 12],
            ['position_key' => 'raeumen_normal.ranges.61_70',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1520.09, 'unitprice' => 0, 'sort' => 13],
            ['position_key' => 'raeumen_normal.ranges.71_80',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1643.21, 'unitprice' => 0, 'sort' => 14],
            ['position_key' => 'raeumen_normal.ranges.81_90',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1812.65, 'unitprice' => 0, 'sort' => 15],
            ['position_key' => 'raeumen_normal.ranges.91_100',   'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1983.31, 'unitprice' => 0, 'sort' => 16],
            ['position_key' => 'raeumen_normal.ranges.101_plus', 'title' => 'Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1983.31, 'unitprice' => 0, 'sort' => 17],

            // Räumen stark
            ['position_key' => 'raeumen_stark.ranges.0_40',      'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => "Entrümpeln, räumen der Bestandswohnung vor Beginn der Umbauarbeiten inkl. sach- und fachgerechter Entsorgung.\nPauschalpreis gilt für eine stark verunreinigte Wohnung.", 'unit' => 'pauschal', 'grundpreis' => 1557.88, 'unitprice' => 0, 'sort' => 30],
            ['position_key' => 'raeumen_stark.ranges.41_50',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 1841.91, 'unitprice' => 0, 'sort' => 31],
            ['position_key' => 'raeumen_stark.ranges.51_60',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 2124.72, 'unitprice' => 0, 'sort' => 32],
            ['position_key' => 'raeumen_stark.ranges.61_70',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 2478.23, 'unitprice' => 0, 'sort' => 33],
            ['position_key' => 'raeumen_stark.ranges.71_80',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 2691.55, 'unitprice' => 0, 'sort' => 34],
            ['position_key' => 'raeumen_stark.ranges.81_90',     'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 2974.36, 'unitprice' => 0, 'sort' => 35],
            ['position_key' => 'raeumen_stark.ranges.91_100',    'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 3257.17, 'unitprice' => 0, 'sort' => 36],
            ['position_key' => 'raeumen_stark.ranges.101_plus',  'title' => 'Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 4106.81, 'unitprice' => 0, 'sort' => 37],

            // Endreinigung
            ['position_key' => 'endreinigung.ranges.0_40',       'title' => 'Endreinigung', 'description' => 'Endreinigung der Wohnung nach erfolgter Sanierung', 'unit' => 'pauschal', 'grundpreis' => 308.41, 'unitprice' => 0, 'sort' => 50],
            ['position_key' => 'endreinigung.ranges.41_50',      'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 385.20, 'unitprice' => 0, 'sort' => 51],
            ['position_key' => 'endreinigung.ranges.51_60',      'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 404.71, 'unitprice' => 0, 'sort' => 52],
            ['position_key' => 'endreinigung.ranges.61_70',      'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 472.97, 'unitprice' => 0, 'sort' => 53],
            ['position_key' => 'endreinigung.ranges.71_80',      'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 540.02, 'unitprice' => 0, 'sort' => 54],
            ['position_key' => 'endreinigung.ranges.81_90',      'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 558.30, 'unitprice' => 0, 'sort' => 55],
            ['position_key' => 'endreinigung.ranges.91_100',     'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 577.81, 'unitprice' => 0, 'sort' => 56],
            ['position_key' => 'endreinigung.ranges.101_plus',   'title' => 'Endreinigung', 'description' => null, 'unit' => 'pauschal', 'grundpreis' => 752.12, 'unitprice' => 0, 'sort' => 57],
        ];

        foreach ($rows as $r) {
            PricebookItem::updateOrCreate(
                ['gewerk_key' => $gewerk, 'position_key' => $r['position_key']],
                array_merge([
                    'gewerk_key' => $gewerk,
                    'is_active' => true,
                ], $r)
            );
        }
    }
}
