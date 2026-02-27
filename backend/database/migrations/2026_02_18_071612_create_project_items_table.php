<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('project_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')->constrained()->cascadeOnDelete();

            $table->string('gewerk_key', 50);
            $table->string('position_key', 120);

            // snapshot teksta + cijene u trenutku spremanja
            $table->string('title_snapshot');
            $table->string('unit_snapshot', 20)->nullable();

            $table->decimal('grundpreis_snapshot', 12, 2)->default(0);
            $table->decimal('unitprice_snapshot', 12, 2)->default(0);

            // koliko korisnik unese (m2, kom, itd.)
            $table->decimal('qty', 12, 2)->default(1);

            // total ove linije (grund + unit*qty) ili fix — kako god ti je frontend izračunao
            $table->decimal('line_total', 12, 2)->default(0);

            $table->integer('sort')->default(0);

            $table->timestamps();

            $table->index(['project_id', 'sort']);
            $table->index(['gewerk_key', 'position_key']);

            $table->decimal('total_net', 12, 2)->default(0);
            $table->decimal('total_gross', 12, 2)->default(0);
            $table->decimal('vat_rate', 5, 2)->default(0); // ili 19.00

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_items');
    }
};
