<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class HaustechnikPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'haustechnik';
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

        // -------------------------
        // META
        // -------------------------
        $add('section.basic', 'Haustechnik', 'Heizung • Lüftung • Sanitär • Gas', 'text', 0, 0, 1);

        // -------------------------
        // Befund (ranges)
        // -------------------------
        $add('befund.ranges.0_40',      'HST Bestand - Befundaufnahme / Statusbericht (0–40 m²)',  'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 282.81, 0, 10);
        $add('befund.ranges.40_50',     'HST Bestand - Befundaufnahme / Statusbericht (40–50 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 335.23, 0, 11);
        $add('befund.ranges.50_60',     'HST Bestand - Befundaufnahme / Statusbericht (50–60 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 462.00, 0, 12);
        $add('befund.ranges.60_70',     'HST Bestand - Befundaufnahme / Statusbericht (60–70 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 514.42, 0, 13);
        $add('befund.ranges.70_80',     'HST Bestand - Befundaufnahme / Statusbericht (70–80 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 639.98, 0, 14);
        $add('befund.ranges.80_90',     'HST Bestand - Befundaufnahme / Statusbericht (80–90 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 692.39, 0, 15);
        $add('befund.ranges.90_100',    'HST Bestand - Befundaufnahme / Statusbericht (90–100 m²)', 'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 744.81, 0, 16);
        $add('befund.ranges.100_plus',  'HST Bestand - Befundaufnahme / Statusbericht (>100 m²)',  'Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.', 'pauschal', 975.20, 0, 17);

        // -------------------------
        // Heizung (ranges + per m²)
        // -------------------------
        $add('heizkoerper_tausch.ranges.0_40',     'Heizung - Heizkörper tauschen ab Wohnungsbereich (0–40 m²)',  'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 1688.81, 0, 30);
        $add('heizkoerper_tausch.ranges.40_50',    'Heizung - Heizkörper tauschen ab Wohnungsbereich (40–50 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 1968.69, 0, 31);
        $add('heizkoerper_tausch.ranges.50_60',    'Heizung - Heizkörper tauschen ab Wohnungsbereich (50–60 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 2336.82, 0, 32);
        $add('heizkoerper_tausch.ranges.60_70',    'Heizung - Heizkörper tauschen ab Wohnungsbereich (60–70 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 2636.70, 0, 33);
        $add('heizkoerper_tausch.ranges.70_80',    'Heizung - Heizkörper tauschen ab Wohnungsbereich (70–80 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 3103.57, 0, 34);
        $add('heizkoerper_tausch.ranges.80_90',    'Heizung - Heizkörper tauschen ab Wohnungsbereich (80–90 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 3520.47, 0, 35);
        $add('heizkoerper_tausch.ranges.90_100',   'Heizung - Heizkörper tauschen ab Wohnungsbereich (90–100 m²)', 'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 3937.37, 0, 36);
        $add('heizkoerper_tausch.ranges.100_plus', 'Heizung - Heizkörper tauschen ab Wohnungsbereich (>100 m²)',  'inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.', 'pauschal', 4838.21, 0, 37);

        $add('heizleitungen_tausch.ranges.0_40',     'Heizungsleitungen tauschen ab Wohnungsbereich (0–40 m²)',  'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 1834.60, 0, 40);
        $add('heizleitungen_tausch.ranges.40_50',    'Heizungsleitungen tauschen ab Wohnungsbereich (40–50 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 2260.03, 0, 41);
        $add('heizleitungen_tausch.ranges.50_60',    'Heizungsleitungen tauschen ab Wohnungsbereich (50–60 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 2752.50, 0, 42);
        $add('heizleitungen_tausch.ranges.60_70',    'Heizungsleitungen tauschen ab Wohnungsbereich (60–70 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 3177.93, 0, 43);
        $add('heizleitungen_tausch.ranges.70_80',    'Heizungsleitungen tauschen ab Wohnungsbereich (70–80 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 3602.15, 0, 44);
        $add('heizleitungen_tausch.ranges.80_90',    'Heizungsleitungen tauschen ab Wohnungsbereich (80–90 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 4060.49, 0, 45);
        $add('heizleitungen_tausch.ranges.90_100',   'Heizungsleitungen tauschen ab Wohnungsbereich (90–100 m²)', 'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 4520.05, 0, 46);
        $add('heizleitungen_tausch.ranges.100_plus', 'Heizungsleitungen tauschen ab Wohnungsbereich (>100 m²)',  'inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).', 'pauschal', 5793.91, 0, 47);

        $add('aufz_sockelkanal.ranges.0_40',     'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (0–40 m²)',  'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 903.28, 0, 50);
        $add('aufz_sockelkanal.ranges.40_50',    'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (40–50 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 1128.80, 0, 51);
        $add('aufz_sockelkanal.ranges.50_60',    'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (50–60 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 1354.31, 0, 52);
        $add('aufz_sockelkanal.ranges.60_70',    'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (60–70 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 1579.82, 0, 53);
        $add('aufz_sockelkanal.ranges.70_80',    'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (70–80 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 1805.34, 0, 54);
        $add('aufz_sockelkanal.ranges.80_90',    'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (80–90 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 2030.85, 0, 55);
        $add('aufz_sockelkanal.ranges.90_100',   'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (90–100 m²)', 'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 2257.59, 0, 56);
        $add('aufz_sockelkanal.ranges.100_plus', 'Aufzahlung - Führung Heizungsleitungen im Sockelkanal (>100 m²)',  'Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.', 'pauschal', 2934.13, 0, 57);

        $add('aufz_fbh.ranges.0_40',     'Aufzahlung Ausführung einer Fußbodenheizung (0–40 m²)',  'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 2534.30, 0, 60);
        $add('aufz_fbh.ranges.40_50',    'Aufzahlung Ausführung einer Fußbodenheizung (40–50 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 3019.46, 0, 61);
        $add('aufz_fbh.ranges.50_60',    'Aufzahlung Ausführung einer Fußbodenheizung (50–60 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 3335.18, 0, 62);
        $add('aufz_fbh.ranges.60_70',    'Aufzahlung Ausführung einer Fußbodenheizung (60–70 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 4424.97, 0, 63);
        $add('aufz_fbh.ranges.70_80',    'Aufzahlung Ausführung einer Fußbodenheizung (70–80 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 4657.80, 0, 64);
        $add('aufz_fbh.ranges.80_90',    'Aufzahlung Ausführung einer Fußbodenheizung (80–90 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 5057.63, 0, 65);
        $add('aufz_fbh.ranges.90_100',   'Aufzahlung Ausführung einer Fußbodenheizung (90–100 m²)', 'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 5457.46, 0, 66);
        $add('aufz_fbh.ranges.100_plus', 'Aufzahlung Ausführung einer Fußbodenheizung (>100 m²)',  'Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.', 'pauschal', 7193.32, 0, 67);

        // Kühl/Heizdecke (per m²) -> unitprice
        $add('kuehl_heizdecke.per_m2', 'Aufzahlung Kühl- und Heizdecke', 'Erfordert Befundaufnahme. Preis: Wohnung m² * 418,00', 'm2', 0, 418.00, 70);

        // -------------------------
        // Lüftung
        // -------------------------
        $add('lueftung_filter.ranges.0_50',     'Lüftung - Filtertausch (0–50 m²)',  'Erfordert Befundaufnahme.', 'pauschal', 85.33, 0, 80);
        $add('lueftung_filter.ranges.50_plus',  'Lüftung - Filtertausch (>50 m²)',   'Erfordert Befundaufnahme.', 'pauschal', 169.44, 0, 81);

        $add('lueftung_ventilator', 'Lüftung - Ventilatortausch exkl. Lüftungsleitungen Bad und WC', 'Fabrikat: Helios oder gleichwertig (Nachlauf, Feuchtsteuerung, Bewegungsmelder weiß). Erfordert Befundaufnahme.', 'pauschal', 1246.30, 0, 85);

        // base + unit (lfm)
        $add('lueftungszuleitung', 'Lüftungszuleitung', null, 'lfm', 257.71, 423.38, 90);

        // -------------------------
        // Sanitär (fix)
        // -------------------------
        $add('sanitaer_bad_gesamt', 'Sanitär Gesamterneuerung Badezimmer', 'WC + Badewanne 170/75 inkl. Wannenträger, WT inkl. Trägergestell, WM-Anschluss, Stand-WC, Armaturen, Zu-/Abfluss, Brandschutz, Entsorgung. Erfordert: Befund + Abbruch Belag + Neuherstellung Fliesen Bad + Neuherstellung Estrich.', 'pauschal', 8331.12, 0, 110);
        $add('sanitaer_fallstrang', 'Sanitär - Anschluss Ablauf an Fallstrang', 'Schacht öffnen, neuer Abzweiger, Wiederherstellung inkl. ggf. Brandschutz. Erfordert Befund.', 'pauschal', 917.91, 0, 111);
        $add('sanitaer_zus_dusche', 'Zusätzliche Dusche', '(Fabrikat Bernstein oder gleichwertig) inkl. Duschkabine, Verfliesung und Armaturen.', 'pauschal', 5995.00, 0, 112);
        $add('aufz_vollglas', 'Aufzahlung Duschkabine in Vollglas inkl. Drehtüre', '(Fabrikat Bernstein oder gleichwertig)', 'pauschal', 2750.00, 0, 113);
        $add('sanitaer_zus_wt', 'Sanitär - Zusätzlicher Waschtisch', 'inkl. Kaltwasseranschluss, Abfluss, Siphon, Armaturen', 'pauschal', 975.20, 0, 114);
        $add('sanitaer_wt_tausch', 'Sanitär - Waschtischtausch', 'WT entsorgen, neuer WT inkl. Siphon und Armatur', 'pauschal', 511.98, 0, 115);
        $add('sanitaer_wc_tausch', 'Sanitär - WC tauschen', 'WC demontieren/entsorgen, Montage neues WC inkl. Deckel', 'pauschal', 585.12, 0, 116);
        $add('sanitaer_wanne_dusche_tausch', 'Sanitär - Bestehende Badewanne/Dusche tauschen', 'Demontage/Entsorgung, Montage inkl. Siphon, Armaturen, Brauseschlauch', 'pauschal', 1194.62, 0, 117);
        $add('sanitaer_gebrauch', 'Sanitär - Gebrauchsoberflächen tauschen', 'z.B. WC-Deckel, Brauseschlauch', 'pauschal', 426.65, 0, 118);
        $add('sanitaer_kueche_aufputz', 'Sanitär/Küche - Warm- & Kaltwasseranschluss sowie Abfluss-Aufputz', 'Erfordert Befundaufnahme.', 'pauschal', 560.74, 0, 119);

        $add('aufz_sprossen_e', 'Sanitär - Aufzahlung Sprossenheizkörper mit E-Patrone (Bad)', 'Erfordert: Befund + Sanitär Gesamterneuerung Badezimmer/WC', 'pauschal', 708.24, 0, 120);
        $add('aufz_haenge_wc', 'Sanitär - Aufzahlung Stand-WC auf Hänge-WC (soweit umsetzbar)', 'Erfordert: Befund + Sanitär Gesamterneuerung Badezimmer/WC', 'pauschal', 991.05, 0, 121);
        $add('aufz_duschtasse', 'Sanitär - Aufzahlung Duschtasse mit Duschtrennwand anstatt Badewanne', 'soweit technisch umsetzbar. Erfordert: Befund + Erneuerung Badezimmer', 'pauschal', 849.64, 0, 122);

        $add('behindertengerecht', 'Sanitärgegenstände behindertengerecht (WC, WT, Dusche Superplan)', 'inkl. Haltegriffe. Hinweis Vorleistungen: Gesamterneuerung Badezimmer, Aufzahlung Duschtasse, Aufzahlung Stand-WC (Hänge-WC).', 'pauschal', 2623.29, 0, 123);

        $add('klappsitz', 'Klappsitz', null, 'pauschal', 660.00, 0, 130);
        $add('armatur', 'Armatur Dusche/Waschtisch', null, 'pauschal', 802.00, 0, 131);
        $add('wc_sensor', 'WC-Betätigung sensorgesteuert', null, 'pauschal', 796.40, 0, 132);
        $add('gebrauch_2', 'Gebrauchsoberflächen tauschen', null, 'pauschal', 441.78, 0, 133);
        $add('untertisch_10l', 'Untertischspeicher 10l', null, 'pauschal', 625.86, 0, 134);
        $add('e_speicher', 'E - Speicher 80l/100l', null, 'pauschal', 1564.66, 0, 135);

        // -------------------------
        // Gas (fix + ranges + base/unit)
        // -------------------------
        $add('gas_pruefung', 'Gas - Überprüfung der Bestandsanlage', 'Überprüfung Gas Zu- & Innenleitungen, Druckprotokolle, Dokumentation. Erfordert Befundaufnahme.', 'pauschal', 483.94, 0, 150);
        $add('gas_service', 'Gastherme servicieren', 'Erfordert Befundaufnahme.', 'pauschal', 343.76, 0, 151);
        $add('gas_therme_neu', 'Gastherme erneuern', 'inkl. Vorbesprechung Gasversorger, Gasleitung außer Betrieb, Entsorgung, Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 6643.55, 0, 152);

        $add('gas_innenleitungen.ranges.0_50',    'Gas Innenleitungen erneuern (0–50 m²)',  'vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 2178.35, 0, 153);
        $add('gas_innenleitungen.ranges.50_70',   'Gas Innenleitungen erneuern (50–70 m²)', 'vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 2240.52, 0, 154);
        $add('gas_innenleitungen.ranges.70_80',   'Gas Innenleitungen erneuern (70–80 m²)', 'vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 2299.03, 0, 155);
        $add('gas_innenleitungen.ranges.80_90',   'Gas Innenleitungen erneuern (80–90 m²)', 'vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 2328.29, 0, 156);
        $add('gas_innenleitungen.ranges.90_plus', 'Gas Innenleitungen erneuern (>90 m²)',   'vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.', 'pauschal', 2358.77, 0, 157);

        $add('gaszuleitung', 'Gaszuleitung', null, 'lfm', 441.79, 202.49, 160);
        $add('zaehlerplatte', 'Zählerplatte', null, 'st', 165.66, 460.20, 170);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
