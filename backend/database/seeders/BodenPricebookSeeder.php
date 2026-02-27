<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class BodenPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'boden';
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
        // Bestand (meta text)
        // -------------------------
        $add(
            'bestand.meta',
            'Bestandbelag',
            "Angenommener Standard: Alle Zimmer ausgenommen verflieste Zimmer\n" .
                "Bestand: Bestehender Belag wird gereinigt und Fehlstellen werden bestmöglich behoben bzw. kaschiert.\n" .
                "Sockelleisten werden auf Stand gebracht (Zwangsspannungen, Ichsenausführung, etc.)\n" .
                "Hinweis: Oberflächen werden je nach Bestand verbessert, die optische Qualität von Neubelägen kann nicht erreicht werden (Stand der Technik)",
            'text',
            0.00,
            0.00,
            1
        );

        // -------------------------
        // Bestand Teppich (tier)
        // -------------------------
        $t = "Bestandbelag Teppich – Tiefenreinigung";
        $add('bestand_teppich.ranges.0_40',   $t, null, 'pauschal', 230.08, 0.00, 10);
        $add('bestand_teppich.ranges.41_50',  $t, null, 'pauschal', 270.62, 0.00, 11);
        $add('bestand_teppich.ranges.51_60',  $t, null, 'pauschal', 336.44, 0.00, 12);
        $add('bestand_teppich.ranges.61_70',  $t, null, 'pauschal', 381.55, 0.00, 13);
        $add('bestand_teppich.ranges.71_80',  $t, null, 'pauschal', 435.18, 0.00, 14);
        $add('bestand_teppich.ranges.81_90',  $t, null, 'pauschal', 499.80, 0.00, 15);
        $add('bestand_teppich.ranges.91_100', $t, null, 'pauschal', 565.62, 0.00, 16);
        $add('bestand_teppich.ranges.101_plus', $t, null, 'pauschal', 726.52, 0.00, 17);

        // -------------------------
        // Bestand Laminat (tier)
        // -------------------------
        $t = "Bestandbelag Laminat – reinigen, aufpolieren, Sockelleisten überarbeiten";
        $add('bestand_laminat.ranges.0_40',   $t, null, 'pauschal', 707.02, 0.00, 20);
        $add('bestand_laminat.ranges.41_50',  $t, null, 'pauschal', 894.75, 0.00, 21);
        $add('bestand_laminat.ranges.51_60',  $t, null, 'pauschal', 1065.41, 0.00, 22);
        $add('bestand_laminat.ranges.61_70',  $t, null, 'pauschal', 1242.16, 0.00, 23);
        $add('bestand_laminat.ranges.71_80',  $t, null, 'pauschal', 1453.05, 0.00, 24);
        $add('bestand_laminat.ranges.81_90',  $t, null, 'pauschal', 1667.59, 0.00, 25);
        $add('bestand_laminat.ranges.91_100', $t, null, 'pauschal', 1882.14, 0.00, 26);
        $add('bestand_laminat.ranges.101_plus', $t, null, 'pauschal', 2517.24, 0.00, 27);

        // -------------------------
        // Bestand Parkett (tier)
        // -------------------------
        $t = "Bestandbelag Parkett – reinigen, ggf. abschleifen, versiegeln, polieren, Sockelleisten überarbeiten/erneuern";
        $add('bestand_parkett.ranges.0_40',   $t, null, 'pauschal', 1751.70, 0.00, 30);
        $add('bestand_parkett.ranges.41_50',  $t, null, 'pauschal', 2210.05, 0.00, 31);
        $add('bestand_parkett.ranges.51_60',  $t, null, 'pauschal', 2612.32, 0.00, 32);
        $add('bestand_parkett.ranges.61_70',  $t, null, 'pauschal', 3041.41, 0.00, 33);
        $add('bestand_parkett.ranges.71_80',  $t, null, 'pauschal', 3557.04, 0.00, 34);
        $add('bestand_parkett.ranges.81_90',  $t, null, 'pauschal', 4072.68, 0.00, 35);
        $add('bestand_parkett.ranges.91_100', $t, null, 'pauschal', 4588.32, 0.00, 36);
        $add('bestand_parkett.ranges.101_plus', $t, null, 'pauschal', 6132.79, 0.00, 37);

        // Teilflächen Sanierung Parkett (base + rate/m2)
        $add('teil_sanierung_parkett', 'Teilflächen Sanierung Bestandbelag Parkett (min. 10m²)', null, 'm2', 331.35, 71.79, 40);

        // -------------------------
        // Neuherstellung (tiers, dependency Abbruch Belag)
        // -------------------------
        $t = "Neuherstellung Teppich (mit Sockelleiste 7cm, Objektqualität)";
        $add('neu_teppich.ranges.0_40',   $t, null, 'pauschal', 1229.35, 0.00, 50);
        $add('neu_teppich.ranges.41_50',  $t, null, 'pauschal', 1554.80, 0.00, 51);
        $add('neu_teppich.ranges.51_60',  $t, null, 'pauschal', 1853.80, 0.00, 52);
        $add('neu_teppich.ranges.61_70',  $t, null, 'pauschal', 2158.55, 0.00, 53);
        $add('neu_teppich.ranges.71_80',  $t, null, 'pauschal', 2524.25, 0.00, 54);
        $add('neu_teppich.ranges.81_90',  $t, null, 'pauschal', 2896.85, 0.00, 55);
        $add('neu_teppich.ranges.91_100', $t, null, 'pauschal', 3270.60, 0.00, 56);
        $add('neu_teppich.ranges.101_plus', $t, null, 'pauschal', 4367.70, 0.00, 57);

        $t = "Neuherstellung Laminat (Standardobjektlaminat, Sockelleiste 7cm, Objektqualität)";
        $add('neu_laminat.ranges.0_40',   $t, null, 'pauschal', 2044.70, 0.00, 60);
        $add('neu_laminat.ranges.41_50',  $t, null, 'pauschal', 2607.05, 0.00, 61);
        $add('neu_laminat.ranges.51_60',  $t, null, 'pauschal', 3140.65, 0.00, 62);
        $add('neu_laminat.ranges.61_70',  $t, null, 'pauschal', 3668.50, 0.00, 63);
        $add('neu_laminat.ranges.71_80',  $t, null, 'pauschal', 4356.20, 0.00, 64);
        $add('neu_laminat.ranges.81_90',  $t, null, 'pauschal', 4981.80, 0.00, 65);
        $add('neu_laminat.ranges.91_100', $t, null, 'pauschal', 5607.40, 0.00, 66);
        $add('neu_laminat.ranges.101_plus', $t, null, 'pauschal', 7503.75, 0.00, 67);

        $t = "Neuherstellung Parkett (Eiche, Sockelleiste 7cm, Objektqualität)";
        $add('neu_parkett.ranges.0_40',   $t, null, 'pauschal', 4100.00, 0.00, 70);
        $add('neu_parkett.ranges.41_50',  $t, null, 'pauschal', 5232.96, 0.00, 71);
        $add('neu_parkett.ranges.51_60',  $t, null, 'pauschal', 6218.28, 0.00, 72);
        $add('neu_parkett.ranges.61_70',  $t, null, 'pauschal', 7280.88, 0.00, 73);
        $add('neu_parkett.ranges.71_80',  $t, null, 'pauschal', 8623.62, 0.00, 74);
        $add('neu_parkett.ranges.81_90',  $t, null, 'pauschal', 9861.48, 0.00, 75);
        $add('neu_parkett.ranges.91_100', $t, null, 'pauschal', 11099.34, 0.00, 76);
        $add('neu_parkett.ranges.101_plus', $t, null, 'pauschal', 14926.08, 0.00, 77);

        // -------------------------
        // Einzelflächen (base + rate/m2)
        // -------------------------
        $add('einzel_teppich', 'Einzelflächen Teppich', null, 'm2', 331.35, 37.56, 80);
        $add('einzel_laminat', 'Einzelflächen Laminat', null, 'm2', 331.35, 69.21, 81);
        $add('einzel_parkett', 'Einzelflächen Parkett', null, 'm2', 331.35, 125.91, 82);

        // Aufzahlungen
        // Antidröhn (Neu Laminat) factor 0.3 -> store in unitprice
        $add('aufz_antidroe', 'Aufzahlung Antidröhnmatte (Neuherstellung Laminat)', null, 'factor', 0.00, 0.30, 90);
        $add('aufz_antidroe_einzel_laminat', 'Aufzahlung Antidröhnmatte (Einzelflächen Laminat)', null, 'm2', 0.00, 20.76, 91);

        $add('aufz_fischgraet', 'Aufzahlung Fischgrätparkett', null, 'm2', 281.32, 72.93, 92);
        $add('aufz_verlegen_versiegeln', 'Aufzahlung verlegen und versiegeln', null, 'm2', 0.00, 66.70, 93);

        $add('mauerfries', 'Mauerfries Eiche', null, 'lfm', 0.00, 165.00, 94);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
