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
        'url',
        'ip_address',
        'user_agent'
    ];

    function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
