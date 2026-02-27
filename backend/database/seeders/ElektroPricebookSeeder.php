<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class ElektroPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'elektro';
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

        // META
        $add('section.basic', 'Elektro', 'Leistungsgrenze Wohnungsverband exkl. Wohnungszuleitung', 'text', 0, 0, 1);

        // ===== m² STAFFEL (ranges) =====
        // Befundaufnahme
        $add(
            'befundaufnahme',
            'Befundaufnahme / Statusbericht',
            "Befundaufnahme/Statusbericht des Bestands (wohnungsbezogen, exkl. Wohnungszuleitung). Planung & Bemessung, Begleitung & Dokumentation, ÖVE-Befund nach Fertigstellung (bereits in der Grundpauschale enthalten).",
            null,
            0,
            0,
            10
        );

        $add('befundaufnahme.ranges.0_40',    'Befundaufnahme (0–40 m²)',  null, 'pauschal', 345.00, 0, 11);
        $add('befundaufnahme.ranges.41_50',   'Befundaufnahme (41–50 m²)', null, 'pauschal', 425.50, 0, 12);
        $add('befundaufnahme.ranges.51_60',   'Befundaufnahme (51–60 m²)', null, 'pauschal', 517.50, 0, 13);
        $add('befundaufnahme.ranges.61_70',   'Befundaufnahme (61–70 m²)', null, 'pauschal', 603.75, 0, 14);
        $add('befundaufnahme.ranges.71_80',   'Befundaufnahme (71–80 m²)', null, 'pauschal', 690.00, 0, 15);
        $add('befundaufnahme.ranges.81_90',   'Befundaufnahme (81–90 m²)', null, 'pauschal', 862.50, 0, 16);
        $add('befundaufnahme.ranges.91_100',  'Befundaufnahme (91–100 m²)', null, 'pauschal', 977.50, 0, 17);
        $add('befundaufnahme.ranges.101_plus', 'Befundaufnahme (>100 m²)',  null, 'pauschal', 1035.00, 0, 18);

        // Wohnungsverteiler (fix)
        $add(
            'wohnungsverteiler',
            'Erneuerung Wohnungsverteiler',
            "inkl. Gehäuse, Automaten (Leitungsschutzschalter, Fehlerstromschutzschalter), auf Stand der Technik. Erfordert Befundaufnahme/Statusbericht.",
            'pauschal',
            1265.00,
            0,
            20
        );

        // Grundinstallation (ranges)
        $add(
            'grundinstallation',
            'Erneuerung der Grundinstallation',
            "Anzahl, Ausführung & Umfang gem. Beilage nach E-8015 inkl. Leerschläuche, auf Stand der Technik (Erneuerung aller Geräte-, Schalter-, und Klemmdosen).",
            null,
            0,
            0,
            30
        );

        $add('grundinstallation.ranges.0_40',    'Grundinstallation (0–40 m²)',  null, 'pauschal', 3565.00, 0, 31);
        $add('grundinstallation.ranges.41_50',   'Grundinstallation (41–50 m²)', null, 'pauschal', 4462.00, 0, 32);
        $add('grundinstallation.ranges.51_60',   'Grundinstallation (51–60 m²)', null, 'pauschal', 5353.25, 0, 33);
        $add('grundinstallation.ranges.61_70',   'Grundinstallation (61–70 m²)', null, 'pauschal', 6198.50, 0, 34);
        $add('grundinstallation.ranges.71_80',   'Grundinstallation (71–80 m²)', null, 'pauschal', 7143.80, 0, 35);
        $add('grundinstallation.ranges.81_90',   'Grundinstallation (81–90 m²)', null, 'pauschal', 7677.40, 0, 36);
        $add('grundinstallation.ranges.91_100',  'Grundinstallation (91–100 m²)', null, 'pauschal', 10350.00, 0, 37);
        $add('grundinstallation.ranges.101_plus', 'Grundinstallation (>100 m²)',  null, 'pauschal', 11597.75, 0, 38);

        // Schalter/Stecker/Sprechstelle (ranges)
        $add(
            'schalter_stecker_sprechst',
            'Erneuerung aller Schalter, Stecker, Sprechstelle, etc.',
            "Schalterprogramm Schrack, Visio 50, weiß; Sprechstelle nur Audio. Anzahl ident Bestand, auf Stand der Technik. Erfordert Befundaufnahme/Statusbericht.",
            null,
            0,
            0,
            40
        );

        $add('schalter_stecker_sprechst.ranges.0_40',    'Schalter/Stecker (0–40 m²)',  null, 'pauschal', 1391.50, 0, 41);
        $add('schalter_stecker_sprechst.ranges.41_50',   'Schalter/Stecker (41–50 m²)', null, 'pauschal', 1656.00, 0, 42);
        $add('schalter_stecker_sprechst.ranges.51_60',   'Schalter/Stecker (51–60 m²)', null, 'pauschal', 1794.00, 0, 43);
        $add('schalter_stecker_sprechst.ranges.61_70',   'Schalter/Stecker (61–70 m²)', null, 'pauschal', 2070.00, 0, 44);
        $add('schalter_stecker_sprechst.ranges.71_80',   'Schalter/Stecker (71–80 m²)', null, 'pauschal', 2346.00, 0, 45);
        $add('schalter_stecker_sprechst.ranges.81_90',   'Schalter/Stecker (81–90 m²)', null, 'pauschal', 2553.00, 0, 46);
        $add('schalter_stecker_sprechst.ranges.91_100',  'Schalter/Stecker (91–100 m²)', null, 'pauschal', 2760.00, 0, 47);
        $add('schalter_stecker_sprechst.ranges.101_plus', 'Schalter/Stecker (>100 m²)',  null, 'pauschal', 3174.00, 0, 48);

        // ===== TEILSANIERUNG (fix) =====
        $add('kleine_e_pauschale', 'Kleine E-Pauschale (bis 5 Schalter/Stecker)', null, 'pauschal', 303.72, 0, 60);
        $add('erdung_badewanne', 'Erdung Badewanne / Dusche', null, 'pauschal', 331.34, 0, 61);

        // ===== RAUMWEISE qty (fix per Stk) =====
        $add('e_raum_bis_10', 'E-Raumweise bis 10m²', null, 'stk', 886.34, 0, 70);
        $add('e_raum_bis_10_leer', 'E-Raumweise bis 10m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)', null, 'stk', 1115.52, 0, 71);

        $add('e_raum_bis_15', 'E-Raumweise bis 15m²', null, 'stk', 1122.88, 0, 72);
        $add('e_raum_bis_15_leer', 'E-Raumweise bis 15m² - Aufzahlung Leerschlauchtausch', null, 'stk', 1601.49, 0, 73);

        $add('e_raum_bis_20', 'E-Raumweise bis 20m²', null, 'stk', 1270.15, 0, 74);
        $add('e_raum_bis_20_leer', 'E-Raumweise bis 20m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)', null, 'stk', 1932.82, 0, 75);

        $add('e_raum_bis_30', 'E-Raumweise bis 30m²', null, 'stk', 1610.69, 0, 76);
        $add('e_raum_bis_30_leer', 'E-Raumweise bis 30m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)', null, 'stk', 2485.07, 0, 77);

        $add('e_raum_bis_40', 'E-Raumweise bis 40m² (inkl. stemmen & verputzen)', null, 'stk', 1905.21, 0, 78);
        $add('e_raum_bis_40_leer', 'E-Raumweise bis 40m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)', null, 'stk', 3037.30, 0, 79);

        // ===== INFRAROT =====
        $add('infrarot_panel', 'Ansatz Infrarot-Paneel', 'Preis je Paneel lt. Variante.', null, 0, 0, 90);

        // variants (unitprice = pricePerSt)
        // variants (grundpreis = base, unitprice = rate per Stk)
        $add('infrarot_panel.variants.190w',  'Infrarot 190W',  null, 'stk', 441.78,  638.76, 91);
        $add('infrarot_panel.variants.300w',  'Infrarot 300W',  null, 'stk', 441.78,  725.27, 92);
        $add('infrarot_panel.variants.675w',  'Infrarot 675W',  null, 'stk', 441.78, 1087.91, 93);
        $add('infrarot_panel.variants.890w',  'Infrarot 890W',  null, 'stk', 441.78, 1399.00, 94);
        $add('infrarot_panel.variants.1050w', 'Infrarot 1050W', null, 'stk', 441.78, 1632.78, 95);

        $add('infrarot_panel.aufz_funk', 'Aufzahlung Funk je Paneel', null, 'stk', 0, 165.67, 96);
        $add('infrarot_panel.aufz_raumthermostat', 'Aufzahlung Raumthermostat', null, 'stk', 0, 404.98, 97);

        // ===== BASE + UNIT ===== (grundpreis=base, unitprice=rate)
        $add('wohnungszuleitung', 'Wohnungszuleitung', null, 'lfm', 331.35, 128.86, 110);
        $add('zaehlerplatz', 'Zählerplatz', null, 'stk', 165.66, 460.20, 111);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
