<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    //

    public function index()
    {
        $query = ActivityLog::with(['user'])->latest();

        $activityLogs = $query->paginate(10);
        return Inertia::render('modules/activity-logs/page', [
            'activityLogs' => $activityLogs
        ]);
    }

    public static function makeLog() {
        
    }
}
