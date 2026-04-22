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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->text('url');
            $table->string('ip_address', 45);
            $table->string('user_agent');

            $table->enum('action', [
                'CREATE',
                'DETAIL',
                'UPDATE',
                'DELETE',
                'APPROVE',
                'REJECT',
                'RETURN',
                'CONFIRM'
            ]);

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
