<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->string('slug')
                ->unique()
                ->after('title');

            $table->string('location')
                ->after('description');

            $table->string('employment_type')
                ->after('location');

            $table->string('experience_level')
                ->after('employment_type');
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropUnique(['slug']);

            $table->dropColumn([
                'slug',
                'location',
                'employment_type',
                'experience_level',
            ]);
        });
    }
};
