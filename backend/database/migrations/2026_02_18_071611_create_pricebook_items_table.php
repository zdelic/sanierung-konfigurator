<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pricebook_items', function (Blueprint $table) {
            $table->id();

            $table->string('gewerk_key', 50);     // npr: abbruch
            $table->string('position_key', 120);  // npr: belag_teil_base

            $table->string('title');
            $table->text('description')->nullable();

            $table->string('unit', 20)->nullable(); // m2, stk, pauschal
            $table->decimal('grundpreis', 12, 2)->default(0);
            $table->decimal('unitprice', 12, 2)->default(0);

            $table->boolean('is_active')->default(true);
            $table->integer('sort')->default(0);

            $table->timestamps();

            $table->unique(['gewerk_key', 'position_key']);
            $table->index(['gewerk_key', 'sort']);

            $table->foreignId('pricebook_item_id')->nullable()
                ->constrained('pricebook_items')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricebook_items');
    }
};
