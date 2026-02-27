<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kalkulation extends Model
{
    protected $table = 'kalkulationen';

    protected $fillable = [
        'user_id',
        'name',
        'project_name',
        'address',
        'customer',
        'created_at_date',
        'note',
        'wohnflaeche_m2',
        'plz',
        'bgk',
        'plz_zuschlag',
        'overhead_total',
        'grand_total',
        'gewerke_totals',
        'gewerke_data',
        'pricebook_version',
    ];

    protected $casts = [
        'gewerke_data' => 'array',
        'gewerke_totals' => 'array',
        'wohnflaeche_m2' => 'float',
        'plz' => 'integer',
        'bgk' => 'float',
        'plz_zuschlag' => 'float',
        'overhead_total' => 'float',
        'grand_total' => 'float',
    ];
}
