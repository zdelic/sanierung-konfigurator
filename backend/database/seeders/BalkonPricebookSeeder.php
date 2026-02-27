<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class BalkonPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'balkon';
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

        // SECTION / META
        $add('section.basic', 'Balkon', 'Sanierung, Abdichtung & Beläge', 'text', 0.00, 0.00, 1);

        // =================
        // Bestand (ranges)
        // =================
        $descBest = "Reinigung der Fugen, Reinigung Rigole + Gully, Nachrichtung Plattenbelag";
        $add('bestand.ranges.0_4',    'Bestand', $descBest, 'pauschal', 1111.73, 0.00, 10);
        $add('bestand.ranges.4_8',    'Bestand', $descBest, 'pauschal', 1219.00, 0.00, 11);
        $add('bestand.ranges.8_plus', 'Bestand', $descBest, 'pauschal', 1325.05, 0.00, 12);

        // ==========================================
        // Balkonsanierung ohne Wärmedämmung (ranges)
        // ==========================================
        $titleOhne = "Balkonsanierung Balkon, Terrasse, Loggia ohne Wärmedämmung mit Tropfnase";
        $descOhne = "Räumung: Räumung Oberflächen, Öffnung Anschlussfugen, inkl. fachgerechter Entsorgung
Schwarzdecker: Abdichtung 2-lagig, Hochzüge, Anschluss mit Flüssigfolie
Spengler: Wasserspeier, Fallrohr für 1 Geschoss, Sohlbank aus Riffelblech, eventuell Attikaabdeckung oder Kiesleiste (Material Zinkblech)
Plattenleger: Estrichplatten 40/40/4cm, Rigol gem. Norm, Revisionsschacht";

        $add('sanierung_ohne_daemmung.ranges.0_4',    $titleOhne, $descOhne, 'pauschal', 4284.90, 0.00, 20);
        $add('sanierung_ohne_daemmung.ranges.4_8',    $titleOhne, $descOhne, 'pauschal', 6557.30, 0.00, 21);
        $add('sanierung_ohne_daemmung.ranges.8_plus', $titleOhne, $descOhne, 'pauschal', 9180.45, 0.00, 22);

        // ==========================================================
        // Balkonsanierung mit Wärmedämmung (XPS bis 10cm) (ranges)
        // ==========================================================
        $titleMit = "Balkonsanierung Balkon, Terrasse, Loggia mit Wärmedämmung (XPS bis 10cm) mit Tropfnase";
        $descMit = "Räumung: Räumung Oberflächen, Öffnung Anschlussfugen, inkl. fachgerechter Entsorgung
Schwarzdecker: Abdichtung 2-lagig, Hochzüge, Anschluss mit Flüssigfolie, Verlegung W.D. (je nach Situation)
Spengler: Wasserspeier, Fallrohr für 1 Geschoss, Sohlbank aus Riffelblech, eventuell Attikaabdeckung oder Kiesleiste (Material Zinkblech)
Plattenleger: Estrichplatten 40/40/4cm, Rigol gem. Norm, Revisionsschacht";

        $add('sanierung_mit_daemmung.ranges.0_4',    $titleMit, $descMit, 'pauschal', 4765.60, 0.00, 30);
        $add('sanierung_mit_daemmung.ranges.4_8',    $titleMit, $descMit, 'pauschal', 7305.95, 0.00, 31);
        $add('sanierung_mit_daemmung.ranges.8_plus', $titleMit, $descMit, 'pauschal', 10351.15, 0.00, 32);

        // ==========================================================
        // Balkonsanierung mit Wärmedämmung (XPS bis 10cm) und Attika
        // ==========================================================
        $titleAtt = "Balkonsanierung Balkon, Terrasse, Loggia mit Wärmedämmung (XPS bis 10cm) und Attika";
        $descAtt = "Räumung: Räumung Oberflächen, Öffnung Anschlussfugen, inkl. fachgerechter Entsorgung
Schwarzdecker: Abdichtung 2-lagig, Hochzüge, Anschluss mit Flüssigfolie, Verlegung W.D. (je nach Situation)
Spengler: Wasserspeier, Fallrohr für 1 Geschoss, Sohlbank aus Riffelblech, eventuell Attikaabdeckung oder Kiesleiste (Material Zinkblech)
Plattenleger: Estrichplatten 40/40/4cm, Rigol gem. Norm, Revisionsschacht";

        $add('sanierung_mit_daemmung_attika.ranges.0_4',    $titleAtt, $descAtt, 'pauschal', 6336.50, 0.00, 40);
        $add('sanierung_mit_daemmung_attika.ranges.4_8',    $titleAtt, $descAtt, 'pauschal', 9423.10, 0.00, 41);
        $add('sanierung_mit_daemmung_attika.ranges.8_plus', $titleAtt, $descAtt, 'pauschal', 12880.00, 0.00, 42);

        // ======================
        // Aufzahlungen (ranges)
        // ======================

        // Stelzlager
        $titleStelz = "Aufzahlung Estrichplatten auf Stelzlager";
        $descStelz = "Aufzahlung auf Grundposition für die Ausführung der Estrichplatten auf Stelzlager";
        $add('aufz_stelzlager.ranges.0_4',    $titleStelz, $descStelz, 'pauschal', 236.49, 0.00, 100);
        $add('aufz_stelzlager.ranges.4_8',    $titleStelz, $descStelz, 'pauschal', 472.97, 0.00, 101);
        $add('aufz_stelzlager.ranges.8_plus', $titleStelz, $descStelz, 'pauschal', 709.46, 0.00, 102);

        // Feinsteinzeugplatte
        $titleFein = "Aufzahlung Feinsteinzeugplatte 40/40/2";
        $descFein = "Aufzahlung auf Grundposition für die Ausführung von Feinsteinzeugplatten anstatt Estrichplatten";
        $add('aufz_feinsteinzeug.ranges.0_4',    $titleFein, $descFein, 'pauschal', 413.24, 0.00, 110);
        $add('aufz_feinsteinzeug.ranges.4_8',    $titleFein, $descFein, 'pauschal', 826.48, 0.00, 111);
        $add('aufz_feinsteinzeug.ranges.8_plus', $titleFein, $descFein, 'pauschal', 1240.94, 0.00, 112);

        // Holzbelag Lärche
        $titleHolz = "Aufzahlung Holzbelag Lärche";
        $descHolz = "Aufzahlung auf Grundposition für die Ausführung Holzbelag Lärche anstatt Estrichplatten
inkl. Riffelung, inkl. UK aus Alu
Hinweis: Wartung!";
        $add('aufz_holz_laerche.ranges.0_4',    $titleHolz, $descHolz, 'pauschal', 472.97, 0.00, 120);
        $add('aufz_holz_laerche.ranges.4_8',    $titleHolz, $descHolz, 'pauschal', 944.73, 0.00, 121);
        $add('aufz_holz_laerche.ranges.8_plus', $titleHolz, $descHolz, 'pauschal', 1417.70, 0.00, 122);

        // Brandschutz
        $titleBrand = "Aufzahlung Brandschutz";
        $descBrand = "Aufzahlung auf Grundposition für die Ausführung der Entwässerung mittels LORO-System DN 70 mit Brandschutzmanschette anstatt Ausführung Alublech beschichtet";
        $add('aufz_brandschutz.ranges.0_8',    $titleBrand, $descBrand, 'pauschal', 570.49, 0.00, 130);
        $add('aufz_brandschutz.ranges.8_plus', $titleBrand, $descBrand, 'pauschal', 1017.87, 0.00, 131);

        // Rinne bei Balkon
        $titleRinne = "Aufzahlung Rinne bei Balkon";
        $descRinne = "Aufzahlung auf die Grundposition für die Ausführung eines Rigols vor Balkontüre";
        $add('aufz_rinne.ranges.0_4',    $titleRinne, $descRinne, 'pauschal', 295.00, 0.00, 140);
        $add('aufz_rinne.ranges.4_8',    $titleRinne, $descRinne, 'pauschal', 591.22, 0.00, 141);
        $add('aufz_rinne.ranges.8_plus', $titleRinne, $descRinne, 'pauschal', 886.21, 0.00, 142);

        // Abdichtung 3te Lage
        $titleAbd3 = "Aufzahlung Abdichtung 3te Lage";
        $descAbd3 = "Aufzahlung auf die Grundposition für die Ausführung einer dritten Abdichtungslage inkl. Hochzügen";
        $add('aufz_abdichtung_3_lage.ranges.0_4',    $titleAbd3, $descAbd3, 'pauschal', 102.40, 0.00, 150);
        $add('aufz_abdichtung_3_lage.ranges.4_8',    $titleAbd3, $descAbd3, 'pauschal', 203.57, 0.00, 151);
        $add('aufz_abdichtung_3_lage.ranges.8_plus', $titleAbd3, $descAbd3, 'pauschal', 260.87, 0.00, 152);

        // Gefälledämmung
        $titleGef = "Aufzahlung Gefälledämmung";
        $descGef = "Aufzahlung auf die Grundposition für die Ausführung mittels Gefälledämmplatten (wenn möglich & ausführbar)";
        $add('aufz_gefaelledaemmung.ranges.0_4',    $titleGef, $descGef, 'pauschal', 437.62, 0.00, 160);
        $add('aufz_gefaelledaemmung.ranges.4_8',    $titleGef, $descGef, 'pauschal', 765.53, 0.00, 161);
        $add('aufz_gefaelledaemmung.ranges.8_plus', $titleGef, $descGef, 'pauschal', 1093.44, 0.00, 162);

        // PUR-Dämmung
        $titlePur = "Aufzahlung PUR-Dämmung";
        $descPur = "Aufzahlung auf die Grundposition für die Ausführung von Dämmplatten mit erhöhtem Dämmwert";
        $add('aufz_pur_daemmung.ranges.0_4',    $titlePur, $descPur, 'pauschal', 415.68, 0.00, 170);
        $add('aufz_pur_daemmung.ranges.4_8',    $titlePur, $descPur, 'pauschal', 727.74, 0.00, 171);
        $add('aufz_pur_daemmung.ranges.8_plus', $titlePur, $descPur, 'pauschal', 1039.81, 0.00, 172);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
