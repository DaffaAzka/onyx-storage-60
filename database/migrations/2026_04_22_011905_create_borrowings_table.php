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
        Schema::create('borrowings', function (Blueprint $table) {
            $table->id();

            $table->string('code', 50)->unique();
            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();
            $table->integer('quantity');
            $table->string('image_path')->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected', 'borrowed', 'returned', 'canceled'])->default('pending');

            $table->date('borrow_date')->nullable();
            $table->date('planned_return_date')->nullable();
            $table->date('actual_return_date')->nullable();
            $table->date('upload_at')->nullable();
            $table->date('approved_at')->nullable();

            $table->foreignId('borrower_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('upload_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};
