<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class EstrichPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'estrich';
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

        // --- Neuherstellung 6cm (pauschal ranges)
        $neuTitle = "Neuherstellung Estrich 6cm";
        $neuDesc = "Neuherstellung Estrich 6cm, Dampfsperre, Trittschalldämmung EPS T 650, Baufolie, Trockenschüttung WD20";

        $add('neu6cm.ranges.0_40',   $neuTitle, $neuDesc, 'pauschal', 3797.89, 0.00, 10);
        $add('neu6cm.ranges.41_50',  $neuTitle, $neuDesc, 'pauschal', 4533.06, 0.00, 11);
        $add('neu6cm.ranges.51_60',  $neuTitle, $neuDesc, 'pauschal', 5408.33, 0.00, 12);
        $add('neu6cm.ranges.61_70',  $neuTitle, $neuDesc, 'pauschal', 6215.82, 0.00, 13);
        $add('neu6cm.ranges.71_80',  $neuTitle, $neuDesc, 'pauschal', 6878.68, 0.00, 14);
        $add('neu6cm.ranges.81_90',  $neuTitle, $neuDesc, 'pauschal', 7683.15, 0.00, 15);
        $add('neu6cm.ranges.91_100', $neuTitle, $neuDesc, 'pauschal', 8487.62, 0.00, 16);
        $add('neu6cm.ranges.101_plus', $neuTitle, $neuDesc, 'pauschal', 10833.24, 0.00, 17);

        // --- Teilleistungen (m2)
        $add('teilleistungen.einzelflaechen', 'Estrich Einzelflächen inkl. Aufbau', null, 'm2', 773.48, 95.54, 30);
        $add('teilleistungen.verdübelung', 'Verdübelung Bestandsestrich', null, 'm2', 261.62, 34.12, 31);
        $add('teilleistungen.trockenestrich', 'Trockenestrich Einzelflächen', null, 'm2', 545.99, 56.87, 32);
        $add('teilleistungen.trockenestrich_ertuechtigung', 'Trockenestrich Einzelflächen Ertüchtigung', null, 'm2', 648.35, 40.95, 33);

        // --- Beschleuniger (pauschal ranges)
        $bTitle = "Aufzahlung Ausführung mit Estrichbeschleuniger";
        $bDesc = "Bei der Aufzahlung Estrich mit Estrichbeschleuniger verkürzt sich die Umbauzeit um 2 Wochen";

        $add('beschleuniger.ranges.0_40',   $bTitle, $bDesc, 'pauschal', 638.76, 0.00, 50);
        $add('beschleuniger.ranges.41_50',  $bTitle, $bDesc, 'pauschal', 795.43, 0.00, 51);
        $add('beschleuniger.ranges.51_60',  $bTitle, $bDesc, 'pauschal', 952.11, 0.00, 52);
        $add('beschleuniger.ranges.61_70',  $bTitle, $bDesc, 'pauschal', 1108.78, 0.00, 53);
        $add('beschleuniger.ranges.71_80',  $bTitle, $bDesc, 'pauschal', 1263.95, 0.00, 54);
        $add('beschleuniger.ranges.81_90',  $bTitle, $bDesc, 'pauschal', 1420.63, 0.00, 55);
        $add('beschleuniger.ranges.91_100', $bTitle, $bDesc, 'pauschal', 1578.81, 0.00, 56);
        $add('beschleuniger.ranges.101_plus', $bTitle, $bDesc, 'pauschal', 2050.35, 0.00, 57);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
