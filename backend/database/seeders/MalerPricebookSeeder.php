<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricebookItem;

class MalerPricebookSeeder extends Seeder
{
    public function run(): void
    {
        $g = 'maler';
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
        // SECTION META (naslovi sekcija u modalu)
        // -----------------------------
        $add('section.bestand', 'Bestand', null, 'text', 0.00, 0.00, 1);
        $add('section.verputz', 'Verputz', null, 'text', 0.00, 0.00, 2);
        $add('section.spachtelung', 'Spachtelung', null, 'text', 0.00, 0.00, 3);
        $add('section.malerei', 'Malerei', null, 'text', 0.00, 0.00, 4);
        $add('section.zargen', 'Zargen', null, 'text', 0.00, 0.00, 5);

        // -----------------------------
        // Bestand Vorarbeiten (tier)
        // -----------------------------
        $add('bestand_vorarbeiten.ranges.0_40',   'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 652.17, 0.00, 10);
        $add('bestand_vorarbeiten.ranges.41_50',  'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 787.47, 0.00, 11);
        $add('bestand_vorarbeiten.ranges.51_60',  'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 983.73, 0.00, 12);
        $add('bestand_vorarbeiten.ranges.61_70',  'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 1108.07, 0.00, 13);
        $add('bestand_vorarbeiten.ranges.71_80',  'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 1243.38, 0.00, 14);
        $add('bestand_vorarbeiten.ranges.81_90',  'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 1403.07, 0.00, 15);
        $add('bestand_vorarbeiten.ranges.91_100', 'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 1563.98, 0.00, 16);
        $add('bestand_vorarbeiten.ranges.101_plus', 'Bestand Vorarbeiten', 'bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\nAbdecken der Schalter und Steckdosen', 'pauschal', 1949.18, 0.00, 17);

        // -----------------------------
        // Bestand starke Verunreinigungen (tier)
        // -----------------------------
        $add('bestand_starke_verunreinigungen.ranges.0_40',   'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 391.30, 0.00, 30);
        $add('bestand_starke_verunreinigungen.ranges.41_50',  'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 459.56, 0.00, 31);
        $add('bestand_starke_verunreinigungen.ranges.51_60',  'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 586.34, 0.00, 32);
        $add('bestand_starke_verunreinigungen.ranges.61_70',  'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 654.60, 0.00, 33);
        $add('bestand_starke_verunreinigungen.ranges.71_80',  'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 722.87, 0.00, 34);
        $add('bestand_starke_verunreinigungen.ranges.81_90',  'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 786.26, 0.00, 35);
        $add('bestand_starke_verunreinigungen.ranges.91_100', 'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 849.64, 0.00, 36);
        $add('bestand_starke_verunreinigungen.ranges.101_plus', 'Bestand starke Verunreinigungen', "Aufzahlung bei starken Verunreinigungen - Desinfektion, Nikotin, Schimmel\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten", 'pauschal', 917.91, 0.00, 37);

        // -----------------------------
        // Bestand Oberflächen überarbeiten (tier)
        // -----------------------------
        $add('bestand_oberflaechen_ueberarbeiten.ranges.0_40',   'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 188.95, 0.00, 50);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.41_50',  'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 229.17, 0.00, 51);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.51_60',  'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 268.18, 0.00, 52);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.61_70',  'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 308.41, 0.00, 53);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.71_80',  'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 347.42, 0.00, 54);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.81_90',  'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 386.42, 0.00, 55);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.91_100', 'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 426.65, 0.00, 56);
        $add('bestand_oberflaechen_ueberarbeiten.ranges.101_plus', 'Bestand - bestehende Oberflächen überarbeiten', "Risse ausspachteln - Die Bestandsflächen werden überarbeitet.\nJe nach vorgefundenem Untergrund kann es sein, dass zusätzliche Maßnahmen wie Bestandsvorarbeiten oder Spachtelarbeiten erforderlich werden.\nRisse ausgespachtelt, Fehlstellen lokal ausgebessert.\nHinweis: Ausbesserungen werden sichtbar bleiben!", 'pauschal', 546.11, 0.00, 57);
        // -----------------------------
        // Innenputz Instand (10% / 50%) + Neu (tier)
        // -----------------------------
        $add('innenputz_instand_10.ranges.0_40',   'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 2407.53, 0.00, 70);
        $add('innenputz_instand_10.ranges.41_50',  'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 3009.71, 0.00, 71);
        $add('innenputz_instand_10.ranges.51_60',  'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 3611.90, 0.00, 72);
        $add('innenputz_instand_10.ranges.61_70',  'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 4212.86, 0.00, 73);
        $add('innenputz_instand_10.ranges.71_80',  'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 4815.05, 0.00, 74);
        $add('innenputz_instand_10.ranges.81_90',  'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 5175.87, 0.00, 75);
        $add('innenputz_instand_10.ranges.91_100', 'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 5536.70, 0.00, 76);
        $add('innenputz_instand_10.ranges.101_plus', 'Verputzarbeiten - Innenputz instandsetzen 10%', 'Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 7198.20, 0.00, 77);

        $add('innenputz_instand_50.ranges.0_40',   'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 4389.62, 0.00, 90);
        $add('innenputz_instand_50.ranges.41_50',  'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 5487.94, 0.00, 91);
        $add('innenputz_instand_50.ranges.51_60',  'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 6585.04, 0.00, 92);
        $add('innenputz_instand_50.ranges.61_70',  'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 7682.14, 0.00, 93);
        $add('innenputz_instand_50.ranges.71_80',  'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 8779.24, 0.00, 94);
        $add('innenputz_instand_50.ranges.81_90',  'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 9437.50, 0.00, 95);
        $add('innenputz_instand_50.ranges.91_100', 'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 10096.98, 0.00, 96);
        $add('innenputz_instand_50.ranges.101_plus', 'Verputzarbeiten - Innenputz instandsetzen 50%', 'Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten und inkl. sach- & fachgerechter Schuttentsorgung\nHINWEIS: Wir weisen darauf hin, dass Ergänzungen optisch erkennbar sein werden!', 'pauschal', 13124.97, 0.00, 97);

        $add('innenputz_neu.ranges.0_40',   'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 4532.24, 0.00, 110);
        $add('innenputz_neu.ranges.41_50',  'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 5664.69, 0.00, 111);
        $add('innenputz_neu.ranges.51_60',  'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 6797.14, 0.00, 112);
        $add('innenputz_neu.ranges.61_70',  'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 7929.60, 0.00, 113);
        $add('innenputz_neu.ranges.71_80',  'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 9063.27, 0.00, 114);
        $add('innenputz_neu.ranges.81_90',  'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 9742.25, 0.00, 115);
        $add('innenputz_neu.ranges.91_100', 'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 10422.45, 0.00, 116);
        $add('innenputz_neu.ranges.101_plus', 'Verputzarbeiten - Innenputz neu herstellen', "Gesamten Putz in der Wohnung abschlagen und nach erfolgter Elektro- und Haustechnikinstallationsarbeiten neu verputzen inkl. sach- & fachgerechter Schuttentsorgung.\nNassräume: Zementputz\nWohnräume: Gipsputz", 'pauschal', 13549.19, 0.00, 117);

        // -----------------------------
        // Verputz Einzelflächen (base + rate/m²)
        // -----------------------------
        $add('verputz_einzelflaechen', 'Verputz Einzelflächen', 'Mindestabrechnung 1m² je Einzelfläche', 'm2', 147.27, 42.34, 200);

        // -----------------------------
        // Neuherstellung Spachtelung / Malerei (tier)
        // -----------------------------
        $add('neu_spachtelung.ranges.0_40',   'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 3217.70, 0.00, 130);
        $add('neu_spachtelung.ranges.41_50',  'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 3965.20, 0.00, 131);
        $add('neu_spachtelung.ranges.51_60',  'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 4769.05, 0.00, 132);
        $add('neu_spachtelung.ranges.61_70',  'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 5517.70, 0.00, 133);
        $add('neu_spachtelung.ranges.71_80',  'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 6265.20, 0.00, 134);
        $add('neu_spachtelung.ranges.81_90',  'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 7041.45, 0.00, 135);
        $add('neu_spachtelung.ranges.91_100', 'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 7817.70, 0.00, 136);
        $add('neu_spachtelung.ranges.101_plus', 'Neuherstellung Spachtelung', 'Wände und Decken vollständig spachteln\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 10062.50, 0.00, 137);

        $add('neu_malerei.ranges.0_40',   'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 1934.30, 0.00, 150);
        $add('neu_malerei.ranges.41_50',  'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 2402.35, 0.00, 151);
        $add('neu_malerei.ranges.51_60',  'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 2901.45, 0.00, 152);
        $add('neu_malerei.ranges.61_70',  'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 3369.50, 0.00, 153);
        $add('neu_malerei.ranges.71_80',  'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 2687.55, 0.00, 154);
        $add('neu_malerei.ranges.81_90',  'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 4320.55, 0.00, 155);
        $add('neu_malerei.ranges.91_100', 'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 4804.70, 0.00, 156);
        $add('neu_malerei.ranges.101_plus', 'Neuherstellung Malerei', 'Wände und Decken malen: Objektqualität weiß, abwaschbar\nHINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)', 'pauschal', 6206.55, 0.00, 157);

        // -----------------------------
        // Einzelflächen spachteln/malen (base + rate/m²)
        // -----------------------------
        $add('einzelflaechen_spachteln', 'Einzelflächen spachteln', null, 'm2', 165.66, 36.81, 210);
        $add('einzelflaechen_malen',     'Einzelflächen malen',     null, 'm2', 138.05, 18.43, 220);

        // -----------------------------
        // Einzelräume spachteln (Fixpreis je Raum) -> meta + items
        // -----------------------------
        $add('einzelraeume_spachteln.meta', 'Einzelräume spachteln (Fixpreis je Raum)', null, 'text', 0.00, 0.00, 240);
        $add('einzelraeume_spachteln.items.spachteln_bis10', 'Einzelräume spachteln – Zi. bis 10m²', null, 'raum', 1538.90, 0.00, 241);
        $add('einzelraeume_spachteln.items.spachteln_bis15', 'Einzelräume spachteln – Zi. bis 15m²', null, 'raum', 2142.67, 0.00, 242);
        $add('einzelraeume_spachteln.items.spachteln_bis20', 'Einzelräume spachteln – Zi. bis 20m²', null, 'raum', 2746.46, 0.00, 243);
        $add('einzelraeume_spachteln.items.spachteln_bis30', 'Einzelräume spachteln – Zi. bis 30m²', null, 'raum', 3501.18, 0.00, 244);
        $add('einzelraeume_spachteln.items.spachteln_bis40', 'Einzelräume spachteln – Zi. bis 40m²', null, 'raum', 4557.80, 0.00, 245);

        // -----------------------------
        // Einzelräume malen (Fixpreis je Raum) -> meta + items
        // -----------------------------
        $add('einzelraeume_malen.meta', 'Einzelräume malen (Fixpreis je Raum)', null, 'text', 0.00, 0.00, 260);
        $add('einzelraeume_malen.items.malen_bis10', 'Einzelräume malen – Zi. bis 10m²', null, 'raum', 815.47, 0.00, 261);
        $add('einzelraeume_malen.items.malen_bis15', 'Einzelräume malen – Zi. bis 15m²', null, 'raum', 1098.95, 0.00, 262);
        $add('einzelraeume_malen.items.malen_bis20', 'Einzelräume malen – Zi. bis 20m²', null, 'raum', 1382.43, 0.00, 263);
        $add('einzelraeume_malen.items.malen_bis30', 'Einzelräume malen – Zi. bis 30m²', null, 'raum', 1736.78, 0.00, 264);
        $add('einzelraeume_malen.items.malen_bis40', 'Einzelräume malen – Zi. bis 40m²', null, 'raum', 2232.88, 0.00, 265);

        // -----------------------------
        // Zargen beschichten (tier) + einzelne Zargen (stk)
        // -----------------------------
        $add('zargen_beschichten.ranges.0_40',   'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 199.92, 0.00, 170);
        $add('zargen_beschichten.ranges.41_50',  'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 285.25, 0.00, 171);
        $add('zargen_beschichten.ranges.51_60',  'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 399.83, 0.00, 172);
        $add('zargen_beschichten.ranges.61_70',  'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 485.16, 0.00, 173);
        $add('zargen_beschichten.ranges.71_80',  'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 569.27, 0.00, 174);
        $add('zargen_beschichten.ranges.81_90',  'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 626.57, 0.00, 175);
        $add('zargen_beschichten.ranges.91_100', 'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 685.08, 0.00, 176);
        $add('zargen_beschichten.ranges.101_plus', 'Neuherstellung Zargen beschichten', 'Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen wie z.B. Kratzern', 'pauschal', 769.19, 0.00, 177);

        $add('einzelne_zarge_bis2', 'Einzelne Zarge – ST Zargen bis 2m²', null, 'stk', 0.00, 110.44, 300);
        $add('einzelne_zarge_bis4', 'Einzelne Zarge – ST Zargen bis 4m²', null, 'stk', 0.00, 143.60, 301);

        PricebookItem::upsert(
            $items,
            ['gewerk_key', 'position_key'],
            ['title', 'description', 'unit', 'grundpreis', 'unitprice', 'is_active', 'sort']
        );
    }
}
