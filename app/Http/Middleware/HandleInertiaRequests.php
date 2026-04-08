<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Auth::user() ?? null;
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => $user ? [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number
                ],
                'role' => $user->role,
            ] : [
                'user' => $request->user(),
                'role' => null,
            ],
            'notifications' => fn() => $request->user()
                ? $request->user()->unreadNotifications()
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(fn($n) => [
                        'id' => $n->id,
                        'data' => $n->data,
                        'created_at' => $n->created_at,
                    ])
                : [],
            'notifications_count' => fn() => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,
        ];
    }
}
