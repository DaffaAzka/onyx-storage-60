<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Auth;
use DB;
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

    public static function makeLog($action, $description)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $description,
            'url' => url()->current(),
            'ip_address' => 'localhost',
            'user_agent' => 'chrome'
        ]);
    }
}
