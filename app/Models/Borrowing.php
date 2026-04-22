<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    //
    protected $fillable = [
        'code',
        'rejection_reason',
        'notes',
        'quantity',
        'image_path',
        'status',
        'borrow_date',
        'planned_return_date',
        'actual_return_date',
        'upload_at',
        'approved_at',
        'borrower_id',
        'approved_by',
        'upload_by',
        'item_id'
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
            $query->where('borrower_id', $user->id);
        }

        return $query;
    }

    function item() {
        return $this->belongsTo(Item::class);
    }

    function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id')->withTrashed();
    }

    function approver()
    {
        return $this->belongsTo(User::class, 'approved_by')->withTrashed();
    }

    function uploader()
    {
        return $this->belongsTo(User::class, 'upload_by')->withTrashed();
    }

    function return_item() {
        return $this->hasOne(ReturnItem::class);
    }
}
