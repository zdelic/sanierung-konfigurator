<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\PricebookItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectsController extends Controller
{
    // POST /api/projects
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'plz' => ['nullable', 'string', 'max:20'],
            'living_area_m2' => ['nullable', 'numeric', 'min:0'],
            'state' => ['nullable', 'array'],
        ]);

        $project = Project::create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return response()->json($project, 201);
    }

    // GET /api/projects/{id}
    public function show(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        $project->load(['items' => function ($q) {
            $q->orderBy('sort')->orderBy('id');
        }]);

        return response()->json($project);
    }

    // PUT /api/projects/{id}
    // Body: { state: {...}, items: [{gewerk_key, position_key, qty, sort}] , name/address/plz/living_area_m2... }
    public function update(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'plz' => ['nullable', 'string', 'max:20'],
            'living_area_m2' => ['nullable', 'numeric', 'min:0'],
            'state' => ['nullable', 'array'],

            'items' => ['required', 'array'],
            'items.*.gewerk_key' => ['required', 'string', 'max:50'],
            'items.*.position_key' => ['required', 'string', 'max:120'],
            'items.*.qty' => ['required', 'numeric', 'min:0'],
            'items.*.sort' => ['nullable', 'integer'],
        ]);

        DB::transaction(function () use ($project, $data) {

            // 1) update project header + state
            $project->update([
                'name' => $data['name'] ?? $project->name,
                'address' => $data['address'] ?? $project->address,
                'plz' => $data['plz'] ?? $project->plz,
                'living_area_m2' => $data['living_area_m2'] ?? $project->living_area_m2,
                'state' => $data['state'] ?? $project->state,
            ]);

            // 2) rebuild snapshot items
            $items = $data['items'];

            // fetch all needed pricebook rows in one query
            $keys = collect($items)->map(fn($i) => $i['gewerk_key'] . '||' . $i['position_key'])->unique()->values();

            $priceRows = PricebookItem::query()
                ->whereIn(DB::raw("CONCAT(gewerk_key,'||',position_key)"), $keys->all())
                ->get()
                ->keyBy(fn($r) => $r->gewerk_key . '||' . $r->position_key);

            // delete old items
            $project->items()->delete();

            $toInsert = [];
            foreach ($items as $idx => $it) {
                $k = $it['gewerk_key'] . '||' . $it['position_key'];
                $row = $priceRows->get($k);

                if (!$row) {
                    // ignore unknown pricebook keys (ili možeš baciti error)
                    continue;
                }

                $qty = (float)$it['qty'];
                $grund = (float)$row->grundpreis;
                $unit = (float)$row->unitprice;

                $lineTotal = round($grund + ($unit * $qty), 2);

                $toInsert[] = [
                    'project_id' => $project->id,
                    'gewerk_key' => $row->gewerk_key,
                    'position_key' => $row->position_key,
                    'title_snapshot' => $row->title,
                    'unit_snapshot' => $row->unit,
                    'grundpreis_snapshot' => $grund,
                    'unitprice_snapshot' => $unit,
                    'qty' => $qty,
                    'line_total' => $lineTotal,
                    'sort' => $it['sort'] ?? ($idx * 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($toInsert)) {
                ProjectItem::insert($toInsert);
            }
        });

        $project->load(['items' => function ($q) {
            $q->orderBy('sort')->orderBy('id');
        }]);

        return response()->json($project);
    }

    // DELETE /api/projects/{id}
    public function destroy(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        $project->delete();

        return response()->json(['ok' => true]);
    }

    private function authorizeOwner(Request $request, Project $project): void
    {
        // admin sve može, ostali samo svoje
        if ($request->user()->hasRole('admin')) return;

        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
