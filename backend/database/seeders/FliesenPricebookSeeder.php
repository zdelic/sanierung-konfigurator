<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class FliesenPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'fliesen';
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

        // -------------------------
        // Bestand (ranges)
        // -------------------------
        $bestandTitle = 'Bestand';
        $bestandDesc =
            "Angenommener Standard: 60/60, 30/60\n" .
            "VR + Kü mit Fliesenbelag, Bad inkl. Wandverfliesung, WC mit Fliesenbelag und Rückwand bis 1,20m\n" .
            "Servicierung bestehender Verfliesung, Tausch Wartungsfuge, Fugen reinigen und überarbeiten, Prüfung ob Fliesen locker, Dokumentierte Prüfung (falls locker: Wiederergänzung mit Bestandsfliesen im Kleinbereich bis max. 5 Stück)";

        $add('bestand.ranges.0_50',   'Bestand',   $bestandDesc, 'pauschal', 500.82, 0.00, 10);
        $add('bestand.ranges.51_70',  'Bestand ',  $bestandDesc, 'pauschal', 630.03, 0.00, 11);
        $add('bestand.ranges.71_100', 'Bestand', $bestandDesc, 'pauschal', 762.90, 0.00, 12);
        $add('bestand.ranges.101_plus', 'Bestand',  $bestandDesc, 'pauschal', 900.65, 0.00, 13);

        // -------------------------
        // Neu Bad/WC (ranges + dependency on Abbruch Belag in UI)
        // -------------------------
        $badTitle = 'Neuherstellung Verfliesung Badezimmer und WC';
        $badDesc =
            "Bad inkl. Wandverfliesung bis Zargen; WC mit Fliesenbelag und Rückwand bis 1,20m:\n" .
            "Objektstandardbodenfliese 30/60cm inkl. Sockelleiste 7cm\n" .
            "Abdichtung Badezimmer gem. Norm: Objektstandardwandfliese 60/60cm inkl. Sockelleiste 7cm";

        $add('neuBadWc.ranges.0_40',    $badTitle,    $badDesc, 'pauschal', 2735.20, 0.00, 30);
        $add('neuBadWc.ranges.41_50',   $badTitle,   $badDesc, 'pauschal', 3286.05, 0.00, 31);
        $add('neuBadWc.ranges.51_60',   $badTitle,   $badDesc, 'pauschal', 3678.20, 0.00, 32);
        $add('neuBadWc.ranges.61_70',   $badTitle,   $badDesc, 'pauschal', 3907.05, 0.00, 33);
        $add('neuBadWc.ranges.71_80',   $badTitle,   $badDesc, 'pauschal', 4354.40, 0.00, 34);
        $add('neuBadWc.ranges.81_90',   $badTitle,   $badDesc, 'pauschal', 4578.65, 0.00, 35);
        $add('neuBadWc.ranges.91_100',  $badTitle,  $badDesc, 'pauschal', 4802.90, 0.00, 36);
        $add('neuBadWc.ranges.101_plus', $badTitle,    $badDesc, 'pauschal', 5251.40, 0.00, 37);

        // -------------------------
        // Neu VR + Kü (ranges + dependency on Abbruch Belag in UI)
        // -------------------------
        $vkTitle = 'Fliesen – VR + Kü mit Fliesenbelag';
        $vkDesc =
            "Angenommener Standard: VR + Kü mit Fliesenbelag\n" .
            "Objektstandardwandfliese 60/60cm inkl. Sockelleiste 7cm";

        $add('neuVrkue.ranges.0_40',     $vkTitle,     $vkDesc, 'pauschal', 809.23, 0.00, 50);
        $add('neuVrkue.ranges.41_50',    $vkTitle,    $vkDesc, 'pauschal', 905.53, 0.00, 51);
        $add('neuVrkue.ranges.51_60',    $vkTitle,    $vkDesc, 'pauschal', 1255.38, 0.00, 52);
        $add('neuVrkue.ranges.61_70',    $vkTitle,    $vkDesc, 'pauschal', 1449.20, 0.00, 53);
        $add('neuVrkue.ranges.71_80',    $vkTitle,    $vkDesc, 'pauschal', 1508.93, 0.00, 54);
        $add('neuVrkue.ranges.81_90',    $vkTitle,    $vkDesc, 'pauschal', 1605.23, 0.00, 55);
        $add('neuVrkue.ranges.91_100',   $vkTitle,   $vkDesc, 'pauschal', 1702.75, 0.00, 56);
        $add('neuVrkue.ranges.101_plus', $vkTitle,     $vkDesc, 'pauschal', 1955.09, 0.00, 57);

        // -------------------------
        // Einzelflächen (base + rate/m2)
        // -------------------------
        $add(
            'einzelflaechen',
            'Fliesen Einzelflächen 30/60, 60/60',
            null,
            'm2',
            322.96, // base
            82.83,  // ratePerM2
            70
        );

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
