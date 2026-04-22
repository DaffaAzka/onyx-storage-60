<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ReturnItem extends Model
{
    protected $fillable = [
        'borrowing_id',
        'received_by',
        'return_date',
        'verified_at',
        'condition',
        'upload_by',
        'fine_amount',
        'fine_paid',
        'notes',
        'image_path',
        'upload_at',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->attributes['image_path']) {
            return '/storage/' . $this->attributes['image_path'];
        }
        return null;
    }

    function scopeFilteringByRole(Builder $query)
    {
        $user = auth()->user();

        if ($user->role === "user") {
            $query->whereHas('borrowing', function (Builder $query) use ($user) {
                $query->where('borrower_id', $user->id);
            });
        }

        return $query;
    }

    function borrowing()
    {
        return $this->belongsTo(Borrowing::class);
    }

    function received()
    {
        return $this->belongsTo(User::class, 'received_by')->withTrashed();
    }


    function uploader()
    {
        return $this->belongsTo(User::class, 'upload_by')->withTrashed();
    }
}
