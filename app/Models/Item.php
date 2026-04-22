<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    //
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'user_id',
        'name',
        'code',
        'description',
        'quantity',
        'available_quantity',
        'image_path',
        'status'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->attributes['image_path']) {
            return '/storage/' . $this->attributes['image_path'];
        } else {
            return '/storage/not_found.jpg';
        }
    }

    function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    function category()
    {
        return $this->belongsTo(Category::class);
    }
}
