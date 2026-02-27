<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'address',
        'plz',
        'living_area_m2',
        'state',
    ];

    protected $casts = [
        'state' => 'array',
        'living_area_m2' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(ProjectItem::class);
    }
}
