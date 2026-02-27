<?php

namespace App\Http\Controllers;

use App\Models\Kalkulation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class KalkulationController extends Controller
{
    public function index(Request $request)
    {
        return Kalkulation::query()
            // ->where('user_id', auth()->id())  // ako imaš auth
            ->orderByDesc('updated_at')
            ->select([
                'id',
                'name',
                'project_name',
                'customer',
                'wohnflaeche_m2',
                'plz',
                'grand_total',
                'updated_at'
            ])
            ->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        // auto-name ako ne pošalješ:
        if (empty($data['name'])) {
            $data['name'] = 'Kalkulation';
        }

        $k = Kalkulation::create([
            // 'user_id' => auth()->id(),
            ...$data,
        ]);

        return response()->json($k, 201);
    }

    public function show(Kalkulation $kalkulation)
    {
        // optional auth check
        return $kalkulation;
    }

    public function update(Request $request, Kalkulation $kalkulation)
    {
        $data = $this->validatePayload($request);

        $kalkulation->update($data);

        return $kalkulation;
    }

    public function destroy(Kalkulation $kalkulation)
    {
        $kalkulation->delete();
        return response()->json(['ok' => true]);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',

            'project_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'customer' => 'nullable|string|max:255',
            'created_at_date' => 'nullable|date',
            'note' => 'nullable|string',
            'wohnflaeche_m2' => 'required|numeric|min:0',
            'plz' => 'required|integer|min:0',

            'bgk' => 'required|numeric|min:0',
            'plz_zuschlag' => 'required|numeric|min:0',
            'overhead_total' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',

            'gewerke_totals' => 'nullable|array',
            'gewerke_data' => 'required|array',

            'pricebook_version' => 'nullable|string|max:255',
        ]);
    }

    public function pdf(Kalkulation $kalkulation)
    {
        $totals = $kalkulation->gewerke_totals ?? [];

        $lines = [];
        $gewerkSummary = [];

        // BGK
        if ($kalkulation->bgk > 0) {
            $lines[] = [
                'label' => 'Baustellengemeinkosten',
                'price' => (float)$kalkulation->bgk,
            ];
        }

        // PLZ
        if ($kalkulation->plz_zuschlag > 0) {
            $lines[] = [
                'label' => 'PLZ-Zuschlag',
                'price' => (float)$kalkulation->plz_zuschlag,
            ];
        }

        $titles = [
            'abbruch' => 'Abbruch',
            'bmst' => 'Baumeisterarbeiten',
            'trockenbau' => 'Trockenbau',
            'estrich' => 'Estrich',
            'fliesen' => 'Fliesen',
            'tischler' => 'Tischler',
            'boden' => 'Bodenbeläge',
            'maler' => 'Malerarbeiten',
            'fenster' => 'Fenster',
            'balkon' => 'Balkon',
            'elektro' => 'Elektro',
            'haustechnik' => 'Haustechnik',
            'reinigung' => 'Reinigung',
        ];

        foreach ($totals as $key => $value) {
            if ((float)$value <= 0) continue;

            $title = $titles[$key] ?? ucfirst($key);

            $lines[] = [
                'label' => $title,
                'price' => (float)$value,
            ];

            $gewerkSummary[] = [
                'title' => $title,
                'price' => (float)$value,
            ];
        }

        $pdf = Pdf::loadView('pdf.kalkulation', [
            'k' => $kalkulation,
            'lines' => $lines,
            'gewerkSummary' => $gewerkSummary,
        ])->setPaper('a4');

        return $pdf->download(
            ($kalkulation->project_name ?? 'Kalkulation') . '.pdf'
        );
    }
}
