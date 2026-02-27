<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class AbbruchPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'abbruch';
        $items = [];

        // Helper
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
                'created_at' => now(),
                'updated_at' => now(),
            ];
        };

        // =========================
        // BELAG
        // =========================
        $belagDesc = "Abbruch des bestehenden Belags (Teppich, Fliesen, Holz, etc.) inkl.\nSockelleisten & inkl. sach- und fachgerechter Entsorgung";
        $add('belag.voll.0_40',   'Belag',   $belagDesc, 'pauschal', 788.26, 0, 10);
        $add('belag.voll.41_50',  'Belag ',  $belagDesc, 'pauschal', 1144.71, 0, 11);
        $add('belag.voll.51_60',  'Belag ',  $belagDesc, 'pauschal', 1373.65, 0, 12);
        $add('belag.voll.61_70',  'Belag ',  $belagDesc, 'pauschal', 1602.59, 0, 13);
        $add('belag.voll.71_80',  'Belag ',  $belagDesc, 'pauschal', 1831.54, 0, 14);
        $add('belag.voll.81_90',  'Belag ',  $belagDesc, 'pauschal', 2060.78, 0, 15);
        $add('belag.voll.91_100', 'Belag ', $belagDesc, 'pauschal', 2289.42, 0, 16);
        $add('belag.voll.101_plus', 'Belag',  $belagDesc, 'pauschal', 2976.25, 0, 17);

        // Teil: base + rate * m2
        $add('belag.teil', 'Belag Teilleistung', $belagDesc, 'm2', 371.98, 19.70, 20);

        // =========================
        // ESTRICH
        // =========================
        $estrichDesc = "Abbruch des Bestandsestrichs inkl.\nUnterbau & inkl.\nsach- und fachgerechter Entsorgung";
        $add('estrich.voll.0_40',   'Estrich',   $estrichDesc, 'pauschal', 2283.62, 0, 30);
        $add('estrich.voll.41_50',  'Estrich ',  $estrichDesc, 'pauschal', 2693.69, 0, 31);
        $add('estrich.voll.51_60',  'Estrich ',  $estrichDesc, 'pauschal', 3232.72, 0, 32);
        $add('estrich.voll.61_70',  'Estrich ',  $estrichDesc, 'pauschal', 3770.30, 0, 33);
        $add('estrich.voll.71_80',  'Estrich ',  $estrichDesc, 'pauschal', 4309.33, 0, 34);
        $add('estrich.voll.81_90',  'Estrich ',  $estrichDesc, 'pauschal', 4687.52, 0, 35);
        $add('estrich.voll.91_100', 'Estrich ', $estrichDesc, 'pauschal', 5067.15, 0, 36);
        $add('estrich.voll.101_plus', 'Estrich',  $estrichDesc, 'pauschal', 6587.15, 0, 37);

        $add('estrich.teil', 'Estrich Teilleistung', $estrichDesc, 'm2', 415.75, 24.00, 40);

        // =========================
        // INNENTÜREN (voll)
        // =========================
        $tuerenVollDesc = "Abbruch – Innentürzargen samt Türblatt";
        $add('innentueren.voll.0_40',  'Innentüren',  $tuerenVollDesc, 'pauschal', 246.33, 0, 50);
        $add('innentueren.voll.41_50', 'Innentüren ', $tuerenVollDesc, 'pauschal', 369.50, 0, 51);
        $add('innentueren.voll.51_60', 'Innentüren ', $tuerenVollDesc, 'pauschal', 369.50, 0, 52);
        $add('innentueren.voll.61_80', 'Innentüren ', $tuerenVollDesc, 'pauschal', 492.66, 0, 53);
        $add('innentueren.voll.81_90', 'Innentüren ', $tuerenVollDesc, 'pauschal', 553.52, 0, 54);
        $add('innentueren.voll.91_plus', 'Innentüren', $tuerenVollDesc, 'pauschal', 614.38, 0, 55);

        // =========================
        // TÜREN (teil) - qty = Stück
        // (u tvom UI formula je base + rate * Stk) :contentReference[oaicite:5]{index=5}
        // =========================
        $add('tuerenTeil.zarge', 'Einzelzarge', "Teilleistung – Abbruch – Innentürzarge (Einzelzarge)", 'stk', 109.40, 76.58, 60);
        $add('tuerenTeil.blatt', 'Einzeltürblatt', "Teilleistung – Abbruch – Einzeltürblatt", 'stk', 109.40, 43.76, 61);
        $add('tuerenTeil.eingang', 'Eingangstüre samt Zarge', "Abbruch Eingangstüre samt Zarge inkl.\nsach- und fachgerechter Entsorgung", 'pauschal', 333.27, 0, 62);

        // =========================
        // WÄNDE / DECKE (svaka linija ima osnovu 875.25 + rate*qty) :contentReference[oaicite:6]{index=6}
        // =========================
        $wdDesc = "Abbruch Teilleistungen – Wände und Decke";
        $wdBase = 875.25;

        $add('waendeDecke.mauerwerk',      'Abbruch Wände Mauerwerk', $wdDesc, 'm2', $wdBase, 51.80, 70);
        $add('waendeDecke.vorsatzschale',  'Abbruch Vorsatzschale',   $wdDesc, 'm2', $wdBase, 39.38, 71);
        $add('waendeDecke.decke',          'Abbruch abgeh. Decke / Verkleidungen', $wdDesc, 'm2', $wdBase, 43.76, 72);
        $add('waendeDecke.trockenbauwaende', 'Abbruch Trockenbauwände', $wdDesc, 'm2', $wdBase, 43.76, 73);
        $add('waendeDecke.kamin',          'Abbruch Kamin',           $wdDesc, 'm2', $wdBase, 153.17, 74);
        $add('waendeDecke.tuerdurchbruch', 'Türdurchbruch (bis 100/220cm, nicht tragend)', $wdDesc, 'stk', $wdBase, 547.03, 75);

        // Upsert by unique (gewerk_key, position_key)
        foreach ($items as $row) {
            PricebookItem::updateOrCreate(
                ['gewerk_key' => $row['gewerk_key'], 'position_key' => $row['position_key']],
                $row
            );
        }
    }
}
