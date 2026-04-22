<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Category;
use App\Models\Item;
use App\Models\ReturnItem;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    //

    function register()
    {
        return Inertia::render('auth/register');
    }

    function login()
    {
        return Inertia::render('auth/login');
    }

    function registerRequest(Request $request)
    {
        $request->validate([
            'fullname' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string',
            'retry_password' => 'required|string|same:password',
        ]);


        User::create([
            'name' => $request->fullname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect('/login');
    }

    function loginRequest(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|exists:users,email',
            'password' => 'required|string',
        ]);


        $user = User::where('email', $request->email)->firstOrFail();

        if (Hash::check($request->password, $user->password)) {
            Auth::login($user);
            return redirect('/dashboard');
        } else {
            return back()->withErrors([
                "email" => "Invalid Credentials."
            ]);
        }

    }

    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today();

        $data = [
            'admin' => null,
            'officer' => null,
            'user' => null,
        ];

        if ($user->role === 'admin') {
            $data['admin'] = [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'inactive_users' => User::where('is_active', false)->count(),
                'total_items' => Item::count(),
                'items_good' => Item::where('status', 'good')->count(),
                'items_fair' => Item::where('status', 'fair')->count(),
                'items_damaged' => Item::where('status', 'damaged')->count(),
                'total_categories' => Category::count(),
                'total_borrowings' => Borrowing::count(),
                'borrowings_approved' => Borrowing::where('status', 'approved')->count(),
                'borrowings_rejected' => Borrowing::where('status', 'rejected')->count(),
                'borrowings_returned' => Borrowing::where('status', 'returned')->count(),
            ];
        }

        if ($user->role === 'officer') {
            $data['officer'] = [
                'total_pending' => Borrowing::where('status', 'pending')->count(),
                'total_borrows' => Borrowing::where('status', 'borrowed')->count(),
                'total_approved_today' => Borrowing::where('status', 'approved')->whereDate('approved_at', $today)->count(),
                'total_rejected_today' => Borrowing::where('status', 'rejected')->whereDate('created_at', $today)->count(),
                'total_lates_today' => Borrowing::where('status', 'borrowed')->where('planned_return_date', '<', $today)->count(),
                'total_returns_today' => ReturnItem::where('return_date', $today)->count(),
                'pending_verifications' => ReturnItem::where('verified_at', null)->count(),
                'fines_pending_collection' => ReturnItem::where('fine_paid', false)->sum('fine_amount'),
            ];
        }

        if ($user->role === 'user') {
            $upcomingReturns = Borrowing::where('borrower_id', $user->id)
                ->where('status', 'borrowed')
                ->with('item')
                ->orderBy('planned_return_date', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($borrowing) {
                    return [
                        'id' => $borrowing->id,
                        'item_name' => $borrowing->item->name ?? 'Unknown',
                        'return_date' => $borrowing->planned_return_date,
                        'quantity' => $borrowing->quantity,
                    ];
                })
                ->toArray();

            $recentBorrowings = Borrowing::where('borrower_id', $user->id)
                ->with('item')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($borrowing) {
                    return [
                        'id' => $borrowing->id,
                        'item_name' => $borrowing->item->name ?? 'Unknown',
                        'status' => $borrowing->status,
                        'created_at' => $borrowing->created_at,
                    ];
                })
                ->toArray();

            $data['user'] = [
                'total_borrowings' => Borrowing::where('borrower_id', $user->id)->count(),
                'total_borrows' => Borrowing::where('borrower_id', $user->id)->where('status', 'borrowed')->count(),
                'total_pending' => Borrowing::where('borrower_id', $user->id)->where('status', 'pending')->count(),
                'total_rejected' => Borrowing::where('borrower_id', $user->id)->where('status', 'rejected')->count(),
                'total_fines' => ReturnItem::whereHas('borrowing', function ($q) use ($user) {
                    $q->where('borrower_id', $user->id);
                })->where('fine_paid', false)->sum('fine_amount'),
                'unpaid_fines_count' => ReturnItem::whereHas('borrowing', function ($q) use ($user) {
                    $q->where('borrower_id', $user->id);
                })->where('fine_paid', false)->count(),
                'upcoming_returns' => $upcomingReturns,
                'recent_borrowings' => $recentBorrowings,
            ];
        }

        return inertia('modules/dashboard/page', [
            'data' => $data
        ]);
    }

    function logout(Request $request)
    {
        Auth::logout();
        return redirect('/login');
    }

    function update(Request $request)
    {

        $id = Auth::id();
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $id,
            'phone_number' => 'nullable|string|min:8'
        ]);

        User::findOrFail($id)->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => ($request->phone_number) ? $request->phone_number : '',
        ]);

        return back();
    }


}
