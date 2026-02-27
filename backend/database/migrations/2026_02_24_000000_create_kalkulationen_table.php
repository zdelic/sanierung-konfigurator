// database/migrations/2026_02_24_000000_create_kalkulationen_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kalkulationen', function (Blueprint $table) {
            $table->id();

            // ako imaš auth:
            $table->unsignedBigInteger('user_id')->nullable()->index();

            $table->string('name'); // "Kalkulacija 1", ...

            // project meta (iz dashboarda)
            $table->string('project_name')->nullable();
            $table->string('address')->nullable();
            $table->string('customer')->nullable();
            $table->date('created_at_date')->nullable();
            $table->text('note')->nullable();
            $table->decimal('wohnflaeche_m2', 10, 2)->default(0);
            $table->integer('plz')->default(0);

            // snapshot totals (za listu)
            $table->decimal('bgk', 12, 2)->default(0);
            $table->decimal('plz_zuschlag', 12, 2)->default(0);
            $table->decimal('overhead_total', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);

            // totals po gewerku (JSON)
            $table->json('gewerke_totals')->nullable();

            // kompletan state svih modala (JSON)
            $table->json('gewerke_data'); // obavezno

            // optional: pricebook snapshot/version
            $table->string('pricebook_version')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kalkulationen');
    }
};
