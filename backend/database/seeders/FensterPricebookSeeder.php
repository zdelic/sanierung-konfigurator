<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class FensterPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'fenster';
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

        // -----------------------------
        // SECTION META (opciono ali lijepo za naslov)
        // -----------------------------
        $add('section.basic', 'Fenster', null, 'text', 0.00, 0.00, 1);
        $add('section.konfigurator', 'Fenster Konfigurator (Fenstertausch)', 'Rohbaumaß, Fenstertyp & Sonnenschutz – Berechnung nach Fensterfläche (m²)', 'text', 0.00, 0.00, 2);

        // -----------------------------
        // A) POSTOJEĆE "FENSTER"
        // servicieren -> ranges (pauschal po wohnfläche global m²)
        // -----------------------------
        $descServ = "Leistungsgrenze Wohnungsverband - einstellen, gangbar machen, schmieren\nHINWEIS: technische Überarbeitung auf Stand der Technik – optisch wird nichts nachgebessert";

        $descGrundpauschale = "Besichtigung der Wohnung, Bestandsdokumentation des IST-Zustandes, planen, koordinieren, überwachen der Revitalisierung, Dokumentation mit Planradar, Abschlussdokumentation";

        $descAbbruchFenster = "inkl. Sohlbank, inkl. Fensterbank, inkl. fachgerechter Entsorgung";

        $descHolzAlu = "herstellen, liefern und montieren\ninnen Fichte weiß\naußen Alu-Deckschale in Standard-RAL\ninkl. Sohlbank - inkl. Fensterbank - inkl. ÖNORM-Montage";
        $descPvcAlu  = "herstellen, liefern und montieren\ninnen weiß - außen Alu-Deckschale in Standard-RAL - inkl. Sohlbank\ninkl. Fensterbank - inkl. ÖNORM-Montage";
        $descPvc     = "herstellen, liefern und montieren\ninnen weiß - außen Alu-Deckschale in Standard-RAL - inkl. Sohlbank - inkl. Fensterbank - inkl. ÖNORM-Montage";

        $descSchallschutz = "Ausführung Schallschutz 43 dB";
        $descNichtTransparent = "nicht transparente Gläser - Verwendung von transluzenten Gläsern bzw. Folien";
        $descOberlichte = "Ausführung einer Oberlichte";
        $descLuefter = "Einbau von Lüfter";

        $descAbbruchSonnenschutz = "Abbruch bestehender Sonnenschutz";

        $descInnenJalousien = "herstellen, liefern und montieren, Standardinnenjalousien in Standard-RAL des Herstellers, Lamellenbreite 25mm, Aufzug mittels Schnur, Wendung der Lamellen mittels Wendestab, einteilige Anlage";
        $descAussenJalousien = "herstellen, liefern und montieren, Standardinnenjalousien in Standard-RAL des Herstellers, Lamellenbreite 80mm, Aufzug mittels Schnur, Wendung der Lamellen mittels Wendestab, einteilige Anlage";
        $descBlinos = "herstellen, liefern und montieren, Standardaußenblinos in Standard-RAL des Herstellers, auch für nachträgliche Montage, kein bohren, kein schrauben, inkl. Rollkasten zum klemmen mit Griffleiste, inkl. seitlicher Führungsschienen, inkl. unteres Abschlusselement zum klemmen, inkl. Klemmwinkel";

        $descAufputz = "Ausführung Aufputz in Standardfarbe";

        $add('servicieren.ranges.0_40',   'Fenster servicieren (0–40 m²)', $descServ, 'pauschal', 241.50, 0.00, 10);
        $add('servicieren.ranges.41_50',  'Fenster servicieren (41–50 m²)', $descServ, 'pauschal', 284.05, 0.00, 11);
        $add('servicieren.ranges.51_60',  'Fenster servicieren (51–60 m²)', $descServ, 'pauschal', 326.60, 0.00, 12);
        $add('servicieren.ranges.61_70',  'Fenster servicieren (61–70 m²)', $descServ, 'pauschal', 326.60, 0.00, 13);
        $add('servicieren.ranges.71_80',  'Fenster servicieren (71–80 m²)', $descServ, 'pauschal', 369.15, 0.00, 14);
        $add('servicieren.ranges.81_90',  'Fenster servicieren (81–90 m²)', $descServ, 'pauschal', 389.85, 0.00, 15);
        $add('servicieren.ranges.91_100', 'Fenster servicieren (91–100 m²)', $descServ, 'pauschal', 410.55, 0.00, 16);
        $add('servicieren.ranges.101_plus', 'Fenster servicieren (>100 m²)', $descServ, 'pauschal', 453.10, 0.00, 17);

        // sanierung_* -> base + rate/m² (m2 input)
        $add('sanierung_bestandsfenster', 'Sanierung Bestandsfenster', 'schleifen, kitten, malen, gangbar machen', 'm2', 331.35, 497.01, 30);
        $add('sanierung_bestandskastenfenster', 'Sanierung Bestandskastenfenster', 'schleifen, kitten, malen, gangbar machen', 'm2', 331.35, 699.50, 31);
        $add('aufz_prallscheibe', 'Aufzahlung Bestandsfenster mit zusätzlicher Prallscheibe', 'schleifen, kitten, malen, gangbar machen', 'm2', 82.83, 147.27, 32);

        // -----------------------------
        // B) FENSTER KONFIGURATOR (Fenstertausch)
        // scalari: spremamo kao items sa unitprice (€/m² ili €/stk), a pauschal kao grundpreis
        // -----------------------------
        $add('konfigurator.grundpauschale', 'Grundpauschale Fenstertausch', $descGrundpauschale, 'pauschal', 251.11, 0.00, 100);

        $add('konfigurator.abbruch_bestehender_fenster', 'Abbruch bestehender Fenster', $descAbbruchFenster, 'm2', 0.00, 119.46, 110);

        $add('konfigurator.typ.holz_alu', 'Holz-Alu-Fenster', $descHolzAlu, 'm2', 0.00, 659.48, 120);
        $add('konfigurator.typ.pvc_alu',  'PVC-Alu-Fenster',  $descPvcAlu,  'm2', 0.00, 543.67, 121);
        $add('konfigurator.typ.pvc',      'PVC-Fenster',      $descPvc,     'm2', 0.00, 525.39, 122);

        $add('konfigurator.aufz.schallschutz_43db', 'Ausführung Schallschutz 43 dB', $descSchallschutz, 'm2', 0.00, 91.43, 140);
        $add('konfigurator.aufz.nicht_transparent', 'Nicht transparente Gläser', $descNichtTransparent, 'm2', 0.00, 28.04, 141);
        $add('konfigurator.aufz.oberlichte', 'Ausführung einer Oberlichte', $descOberlichte, 'm2', 0.00, 146.28, 142);
        $add('konfigurator.luefter', 'Einbau von Lüfter', $descLuefter, 'stk', 0.00, 203.57, 150);

        $add('konfigurator.sonnenschutz.abbruch', 'Abbruch bestehender Sonnenschutz', $descAbbruchSonnenschutz, 'm2', 0.00, 54.86, 160);

        $add('konfigurator.sonnenschutz.montage.innenjalousien', 'Montage Sonnenschutz Innenjalousien', $descInnenJalousien, 'm2', 0.00, 70.70, 170);
        $add('konfigurator.sonnenschutz.montage.aussenjalousien', 'Montage Sonnenschutz Außenjalousien', $descAussenJalousien, 'm2', 0.00, 392.52, 171);
        $add('konfigurator.sonnenschutz.montage.blinos', 'BLINOS ROLLO - Montage Sonnenschutz', $descBlinos, 'm2', 0.00, 392.52, 172);

        $add(
            'konfigurator.sonnenschutz.aufputz',
            'Aufzahlung Sonnenschutzkasten',
            $descAufputz,
            'm2',
            0.00,
            112.15,
            180
        );

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
