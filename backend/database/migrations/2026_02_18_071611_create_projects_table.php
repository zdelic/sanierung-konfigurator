<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('name')->nullable();        // npr. "Wohnung Müller"
            $table->string('address')->nullable();
            $table->string('plz', 20)->nullable();
            $table->decimal('living_area_m2', 10, 2)->nullable();

            // kompletan frontend state za edit/load
            $table->json('state')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'created_at']);

            $table->json('meta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
