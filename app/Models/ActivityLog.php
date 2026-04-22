<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    //
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'created_at',
    ];

    function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
