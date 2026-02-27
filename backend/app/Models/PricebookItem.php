<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricebookItem extends Model
{
    protected $fillable = [
        'gewerk_key',
        'position_key',
        'title',
        'description',
        'unit',
        'grundpreis',
        'unitprice',
        'is_active',
        'sort',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'grundpreis' => 'decimal:2',
        'unitprice' => 'decimal:2',
    ];
}
