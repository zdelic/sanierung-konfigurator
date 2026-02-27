<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricebookItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PricebookController extends Controller
{
    // GET /api/pricebook?gewerk=abbruch
    public function index(Request $request)
    {
        $gewerk = $request->query('gewerk');

        $q = PricebookItem::query()->where('is_active', true);

        if ($gewerk) {
            $q->where('gewerk_key', $gewerk);
        }

        return response()->json(
            $q->orderBy('gewerk_key')->orderBy('sort')->get()
        );
    }

    // PUT /api/pricebook/items/{id}
    public function update(Request $request, PricebookItem $item)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'unit' => ['sometimes', 'nullable', 'string', 'max:20'],
            'grundpreis' => ['sometimes', 'numeric', 'min:0'],
            'unitprice' => ['sometimes', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sort' => ['sometimes', 'integer'],
        ]);

        $item->update($data);

        return response()->json($item);
    }

    // POST /api/pricebook/bulk
    // Body:
    // { "percent": 10, "gewerk_key": "abbruch", "fields": ["grundpreis","unitprice"] }
    public function bulk(Request $request)
    {
        $data = $request->validate([
            'percent' => ['required', 'numeric'], // može i -10
            'gewerk_key' => ['nullable', 'string', 'max:50'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*' => [Rule::in(['grundpreis', 'unitprice'])],
        ]);

        $mult = 1 + ($data['percent'] / 100);

        $q = PricebookItem::query();
        if (!empty($data['gewerk_key'])) {
            $q->where('gewerk_key', $data['gewerk_key']);
        }

        $count = 0;
        $q->chunkById(500, function ($items) use (&$count, $data, $mult) {
            foreach ($items as $item) {
                $payload = [];
                foreach ($data['fields'] as $f) {
                    $payload[$f] = round(((float)$item->{$f}) * $mult, 2);
                }
                $item->update($payload);
                $count++;
            }
        });

        return response()->json([
            'updated' => $count,
            'percent' => $data['percent'],
            'gewerk_key' => $data['gewerk_key'] ?? null,
            'fields' => $data['fields'],
        ]);
    }
}
