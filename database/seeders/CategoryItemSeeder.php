<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        $categories = [
            ['name' => 'Electronics', 'description' => 'Electronic devices and accessories'],
            ['name' => 'Furniture', 'description' => 'Office and home furniture'],
            ['name' => 'Stationery', 'description' => 'Office stationery and supplies'],
        ];

        foreach ($categories as $cat) {
            Category::create([...$cat, 'user_id' => $user->id]);
        }

        $electronics = Category::where('name', 'Electronics')->first();
        $furniture = Category::where('name', 'Furniture')->first();
        $stationery = Category::where('name', 'Stationery')->first();

        // Buat items
        $laptop = Item::create([
            'category_id' => $electronics->id,
            'user_id' => $user->id,
            'name' => 'Laptop Dell XPS',
            'code' => 'ELEC-001',
            'description' => 'Dell XPS 15 inch laptop',
            'status' => 'good',
            'quantity' => 10,
            'available_quantity' => 10,
            'ref_item_id' => null,
        ]);

        // Item yang mereferensi item lain (ref_item_id)
        Item::create([
            'category_id' => $electronics->id,
            'user_id' => $user->id,
            'name' => 'Laptop Dell XPS (Backup)',
            'code' => 'ELEC-002',
            'description' => 'Backup unit dari Laptop Dell XPS',
            'status' => 'good',
            'quantity' => 5,
            'available_quantity' => 5,
            'ref_item_id' => $laptop->id, // mereferensi item di atas
        ]);

        Item::create([
            'category_id' => $furniture->id,
            'user_id' => $user->id,
            'name' => 'Office Chair',
            'code' => 'FURN-001',
            'description' => 'Ergonomic office chair',
            'status' => 'good',
            'quantity' => 20,
            'available_quantity' => 18,
            'ref_item_id' => null,
        ]);

        Item::create([
            'category_id' => $stationery->id,
            'user_id' => $user->id,
            'name' => 'Whiteboard Marker',
            'code' => 'STAT-001',
            'description' => 'Spidol whiteboard warna-warni',
            'status' => 'fair',
            'quantity' => 100,
            'available_quantity' => 80,
            'ref_item_id' => null,
        ]);
    }
}
