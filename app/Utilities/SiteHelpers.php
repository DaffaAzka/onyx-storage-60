<?php

namespace App\Utilities;

use App\Models\ActivityLog;

class SiteHelpers
{
    public static function generateLog(string $description, string $type, string $url = "/")
    {
        ActivityLog::create([
            "description" => $description,
            "type" => $type,
            "url" => $url,
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
