<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectItem extends Model
{
    protected $fillable = [
        'project_id',
        'gewerk_key',
        'position_key',
        'title_snapshot',
        'unit_snapshot',
        'grundpreis_snapshot',
        'unitprice_snapshot',
        'qty',
        'line_total',
        'sort',
    ];

    protected $casts = [
        'grundpreis_snapshot' => 'decimal:2',
        'unitprice_snapshot' => 'decimal:2',
        'qty' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
