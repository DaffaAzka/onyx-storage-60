<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('return_items', function (Blueprint $table) {
            $table->id();

            $table->integer('fine_amount')->nullable();
            $table->boolean('fine_paid')->default(false);
            $table->string('image_path')->nullable();
            $table->text('notes')->nullable();

            $table->enum('condition', ['fair', 'damaged', 'good'])->default('good');

            $table->date('verified_at')->nullable();
            $table->date('upload_at')->nullable();
            $table->date('return_date')->nullable();


            $table->foreignId('upload_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('borrowing_id')->nullable()->constrained('borrowings')->nullOnDelete();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
