<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class TischlerPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'tischler';
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
        // Bestand (tier / pauschal by global m²)
        // -------------------------
        $bestandTitle = "Bestand";
        $bestandDesc =
            "Hinweis: Technische Überarbeitung, auf Stand der Technik, optisch wird nicht nachgebessert\n" .
            "Servicierung bestehender Türblätter\n" .
            "Wohnungseingangstüre\n" .
            "Innentüren: einstellen, gangbar machen, schmieren";

        $add('bestand.ranges.0_40',   $bestandTitle, $bestandDesc, 'pauschal', 213.33, 0.00, 10);
        $add('bestand.ranges.41_50',  $bestandTitle, $bestandDesc, 'pauschal', 226.73, 0.00, 11);
        $add('bestand.ranges.51_60',  $bestandTitle, $bestandDesc, 'pauschal', 241.36, 0.00, 12);
        $add('bestand.ranges.61_70',  $bestandTitle, $bestandDesc, 'pauschal', 256.00, 0.00, 13);
        $add('bestand.ranges.71_80',  $bestandTitle, $bestandDesc, 'pauschal', 269.40, 0.00, 14);
        $add('bestand.ranges.81_90',  $bestandTitle, $bestandDesc, 'pauschal', 282.81, 0.00, 15);
        $add('bestand.ranges.91_100', $bestandTitle, $bestandDesc, 'pauschal', 297.44, 0.00, 16);
        $add('bestand.ranges.101_plus', $bestandTitle, $bestandDesc, 'pauschal', 340.10, 0.00, 17);

        // -------------------------
        // Sanierung Bestandstüre (base + rate / stk)
        // -------------------------
        $add('sanierung_2m2_simple', 'Sanierung Bestandstüre bis 2m² (einfache, glatte Oberfläche)', null, 'stk', 211.70, 147.27, 30);
        $add('aufzahlung_2m2_aufwendig', 'Aufzahlung aufwendige, gegliederte Oberfläche (Bestandstüre bis 2m²)', null, 'stk', 165.67, 257.71, 31);
        $add('sanierung_4m2_simple', 'Sanierung Bestandstüre bis 4m² (einfache, glatte Oberfläche)', null, 'stk', 211.69, 294.52, 32);
        $add('aufzahlung_4m2_aufwendig', 'Aufzahlung aufwendige, gegliederte Oberfläche (Bestandstüre bis 4m²)', null, 'stk', 165.67, 515.42, 33);

        // -------------------------
        // Neuherstellung – Eingangstüre (tier single)
        // -------------------------
        $add(
            'neu_eingang.ranges.0_plus',
            'Neuherstellung – Eingangstüre',
            'Wohnungseingangstüre 85-90/200-210cm Objekttürblatt weiß mit Stahlblockzarge, Spion, Sicherheitsbeschlag, WK3, Klimaanforderung Whg./Stg. sowie Türstopper schwer',
            'pauschal',
            2711.06,
            0.00,
            40
        );

        // -------------------------
        // Neuherstellung – Innentüren (tier)
        // -------------------------
        $neuInnentTitle = 'Neuherstellung – Innentüren';
        $neuInnentDesc =
            'Innentürblätter 80/200cm, Objekttürblatt Wabe, weiß, Standardbeschlag und Buntbartschlüssel, AR mit Lüftungsgitter, WC und Bad mit Sanitärbeschlag, Türblätter gekürzt sowie Türstopper leicht';

        $add('neu_innentueren.ranges.0_40',   $neuInnentTitle, $neuInnentDesc, 'pauschal', 720.43, 0.00, 50);
        $add('neu_innentueren.ranges.41_50',  $neuInnentTitle, $neuInnentDesc, 'pauschal', 956.91, 0.00, 51);
        $add('neu_innentueren.ranges.51_60',  $neuInnentTitle, $neuInnentDesc, 'pauschal', 1178.77, 0.00, 52);
        $add('neu_innentueren.ranges.61_70',  $neuInnentTitle, $neuInnentDesc, 'pauschal', 1400.63, 0.00, 53);
        $add('neu_innentueren.ranges.71_80',  $neuInnentTitle, $neuInnentDesc, 'pauschal', 1623.71, 0.00, 54);
        $add('neu_innentueren.ranges.81_90',  $neuInnentTitle, $neuInnentDesc, 'pauschal', 1763.89, 0.00, 55);
        $add('neu_innentueren.ranges.91_100', $neuInnentTitle, $neuInnentDesc, 'pauschal', 1905.30, 0.00, 56);
        $add('neu_innentueren.ranges.101_plus', $neuInnentTitle, $neuInnentDesc, 'pauschal', 2127.15, 0.00, 57);

        // Einzelpositionen (base+rate)
        $add('neu_innentueren_glasausschnitt', 'Neuherstellung – Innentüren – Aufzahlung Glasausschnitt', null, 'stk', 128.86, 147.27, 60);
        $add('innentuere_80x200', 'Innentüre 80/200', null, 'stk', 211.69, 294.52, 61);

        // -------------------------
        // Neuherstellung Zargen (tier)
        // -------------------------
        $neuZTitle = 'Neuherstellung Zargen';
        $neuZDesc = 'Objektholzzarge weiß in bestehendem Durchbruch bzw. Stahlzarge Profil 42 je nach Einbausituation';

        $add('neu_zargen.ranges.0_40',   $neuZTitle, $neuZDesc, 'pauschal', 958.13, 0.00, 70);
        $add('neu_zargen.ranges.41_50',  $neuZTitle, $neuZDesc, 'pauschal', 1382.35, 0.00, 71);
        $add('neu_zargen.ranges.51_60',  $neuZTitle, $neuZDesc, 'pauschal', 1861.41, 0.00, 72);
        $add('neu_zargen.ranges.61_70',  $neuZTitle, $neuZDesc, 'pauschal', 2285.63, 0.00, 73);
        $add('neu_zargen.ranges.71_80',  $neuZTitle, $neuZDesc, 'pauschal', 2711.06, 0.00, 74);
        $add('neu_zargen.ranges.81_90',  $neuZTitle, $neuZDesc, 'pauschal', 2949.98, 0.00, 75);
        $add('neu_zargen.ranges.91_100', $neuZTitle, $neuZDesc, 'pauschal', 3188.90, 0.00, 76);
        $add('neu_zargen.ranges.101_plus', $neuZTitle, $neuZDesc, 'pauschal', 3614.34, 0.00, 77);

        $add('zarge_80x200', 'Zarge 80/200', null, 'stk', 211.69, 404.98, 80);

        // -------------------------
        // Fixe Stückpreise (rate only => grundpreis 0, unitprice = rate)
        // -------------------------
        $add(
            'whg_eingang_h250',
            'Wohnungseingangstür bis H 250 – Instandsetzen',
            'Tischlermäßiges Instandsetzen, sämtliche Zusatzschlösser entfernen, Schraublöcher verkitten, inklusive neuer Türstaffel und dreifach Verriegelung',
            'stk',
            0.00,
            1078.00,
            90
        );

        $add(
            'whg_eingang_2fluegelig_h250',
            '2-Flügelig Wohnungseingangstür bis H 250 – Instandsetzen',
            'Tischlermäßiges Instandsetzen, sämtliche Zusatzschlösser entfernen, Schraublöcher verkitten, inklusive neuer Türstaffel und dreifach Verriegelung',
            'stk',
            0.00,
            1782.00,
            91
        );

        $add(
            'balkon_bis3',
            'Balkon Innentüre: bis 3m²',
            'Tischlermäßiges Instandsetzen inklusive Beschläge, neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4, Argon gefüllt liefern und einbauen',
            'stk',
            0.00,
            1164.00,
            92
        );

        $add(
            'balkon_ueber3',
            'Balkon Innentüre: über 3m²',
            'Tischlermäßiges Instandsetzen inklusive Beschläge, neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4, Argon gefüllt liefern und einbauen',
            'stk',
            0.00,
            1716.00,
            93
        );

        $add(
            'kasten_bis3',
            'Kastenfenster bis 3m²',
            'Tischlermäßiges Instandsetzen inklusive Beschläge. Stock und Vertäfelung sanieren, Innen Flügel–Stock neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4 (Argon) liefern und einbauen.',
            'stk',
            0.00,
            1524.00,
            94
        );

        $add(
            'kasten_3_5',
            'Kastenfenster: 3–5 m²',
            'Tischlermäßiges Instandsetzen inklusive Beschläge. Stock und Vertäfelung sanieren, Innen Flügel–Stock neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4 (Argon) liefern und einbauen.',
            'stk',
            0.00,
            2178.00,
            95
        );

        $add(
            'anstrich_eingang',
            'Anstricharbeiten Eingangstür',
            'Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016/8017',
            'stk',
            0.00,
            923.50,
            96
        );

        $add(
            'anstrich_balkon',
            'Anstricharbeiten Balkoninnentür (bis 3m²)',
            'Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016',
            'stk',
            0.00,
            894.30,
            97
        );

        $add(
            'anstrich_kasten',
            'Anstricharbeiten Kastenfenster (bis 3m²)',
            'Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016',
            'stk',
            0.00,
            828.30,
            98
        );

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
