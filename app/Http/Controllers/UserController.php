<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::whereNot('id', Auth::id());

        if ($request->search) {
            $query->where('name', 'like', "%$request->search%")->orWhere('email', 'like', "%$request->search%")->orWhere('phone_number', 'like', "%$request->search%");
        }

        if ($request->role && $request->role !== "all") {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(10);
        return Inertia::render('modules/users/page', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'role' => 'required|string',
            'phone_number' => 'nullable|string',
            'password' => 'required|string',
            'retry_password' => 'required|string|same:password',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'phone_number' => $request->phone_number ?? '',
            'password' => Hash::make($request->password),
        ]);

        return back();

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'retry_password' => 'nullable|string|same:password',
            'role' => 'required|in:admin,officer,user',
            'phone_number' => 'nullable|string|unique:users,phone_number,' . $id,
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'phone_number' => $request->phone_number,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        User::findOrFail($id)->update($data);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::with('borrowings')->findOrFail($id);

        if ($user->borrowings()->whereIn('status', ['borrowed', 'pending', 'approved'])->exists()) {
            return back()->withErrors(['message' => 'Cannot delete user because they still have active borrowing transactions.']);
        } else {
            $user->delete();
            return back();
        }
    }
}
