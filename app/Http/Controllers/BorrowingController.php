<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->syncLate();

        $query = Borrowing::with(['item', 'item.category', 'borrower', 'approver', 'uploader'])
            ->filteringByRole()
            ->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query = $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%$search%")
                    ->orWhereHas('item', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%")
                            ->orWhere('code', 'like', "%$search%");
                    });
            });
        }

        $borrowings = $query->paginate(10);
        $user = auth()->user();

        return inertia('modules/borrowings/page', [
            'borrowings' => $borrowings,
            'user' => $user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $auth = Auth::user();
        $users = null;

        $categories = Category::all();
        $query = Item::with(['category', 'user']);

        if ($request->has('search') && $request->search) {
            $query = $query->where('name', 'like', "%$request->search%")
                ->orWhere('code', 'like', "%$request->search%")
                ->orWhere('description', 'like', "%$request->search%");
        }

        if ($request->has('category_id') && $request->category_id && $request->category_id != 'all') {
            $query = $query->where('category_id', $request->category_id);
        }

        if ($auth->role == "admin" || $auth->role == "officer" ) {
            $users = User::all();
        }

        $items = $query->orderBy('available_quantity', 'desc')->paginate(6);
        $borrowings = Borrowing::with(['item', 'item.category', 'borrower', 'approver'])->filteringByRole()->get();

        return Inertia::render('modules/borrowings/create/page', [
            'items' => $items,
            'categories' => $categories,
            'borrowings' => $borrowings,
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'planned_return_date' => 'required|date|after:borrow_date',
            'notes' => 'nullable|string',
            'borrow_date' => 'required|date',
            'user_id' => 'exists:users,id|optional'
        ]);

        DB::transaction(function () use ($request) {
            $code = 'BR-' . $request->item_id . '-' . random_int(1000, 9999);

            Borrowing::create([
                'borrower_id' => $request->user_id ?? auth()->id(),
                'item_id' => $request->item_id,
                'quantity' => $request->quantity,
                'borrow_date' => $request->borrow_date,
                'planned_return_date' => $request->planned_return_date,
                'notes' => $request->notes,
                'code' => $code,
            ]);

            Item::findOrFail($request->item_id)->decrement('available_quantity', $request->quantity);
            ActivityLogController::makeLog("CREATE", "Creating new Borrowing " . $code);
        });

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
        $borrowing = Borrowing::with('item')->findOrFail($id);

        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'planned_return_date' => 'required|date|after:today',
            'notes' => 'nullable|string',
            'borrow_date' => 'required|date',
        ]);

        if ($borrowing->status === 'rejected') {
            if ($borrowing->item->available_quantity < $borrowing->quantity) {
                return back()->withErrors(['status' => 'Not enough available quantity to approve this borrowing.']);
            } else {
                DB::transaction(function () use ($borrowing, $request, $id) {
                    $borrowing->item()->update([
                        'available_quantity' => $borrowing->item->available_quantity - $borrowing->quantity
                    ]);
                    Borrowing::findOrFail($id)->update([
                        'item_id' => $request->item_id,
                        'quantity' => $request->quantity,
                        'borrow_date' => $request->borrow_date,
                        'planned_return_date' => $request->planned_return_date,
                        'notes' => $request->notes,
                        'status' => 'pending'
                    ]);

                    ActivityLogController::makeLog("UPDATE", "ReSubmit Borrowing " . $borrowing->code);
                });
            }
        } else {
            DB::transaction(function () use ($borrowing, $request, $id) {
                Borrowing::findOrFail($id)->update([
                    'item_id' => $request->item_id,
                    'quantity' => $request->quantity,
                    'borrow_date' => $request->borrow_date,
                    'planned_return_date' => $request->planned_return_date,
                    'notes' => $request->notes,
                ]);

                ActivityLogController::makeLog("UPDATE", "Updating Borrowing " . $borrowing->code);
            });
        }

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $borrowing = Borrowing::findOrFail($id);
        if ($borrowing->status == "rejected") {
            DB::transaction(function () use ($borrowing) {
                ActivityLogController::makeLog("DELETE", "Deleted Borrowing " . $borrowing->code);
                $borrowing->delete();
            });
        }
    }

    public function syncLate()
    {
        $lateBorrowings = Borrowing::where('status', 'borrowed')
            ->where('planned_return_date', '<', now())
            ->get();

        foreach ($lateBorrowings as $borrowing) {
            $borrowing->update(['status' => 'late']);
        }

        return back();
    }

    public function updateStatus(string $id, Request $request)
    {
        $borrowing = Borrowing::with('item')->findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,approved,rejected,borrowed,returned,late',
            'rejection_reason' => 'nullable|required_if:status,rejected|string',
            'image_path' => 'nullable|required_if:status,borrowed|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $path = $file->store('borrowings', 'public');
            $image_path = $path;
            $request['upload_by'] = Auth::id();
            $request['upload_at'] = now();
        } else {
            $image_path = null;
        }

        DB::transaction(function () use ($request, $borrowing, $image_path) {
            $borrowing->update([
                'status' => $request['status'],
                'rejection_reason' => $request['rejection_reason'] ?? null,
                'image_path' => $image_path ?? null,
                'approved_by' => $request['status'] === 'approved' ? auth()->id() : $borrowing->approved_by,
                'approved_at' => now(),
                'upload_by' => $request->upload_by ?? null,
                'upload_at' => $request->upload_at ?? null,
            ]);

            if ($request['status'] === 'rejected') {
                $borrowing->item()->update([
                    'available_quantity' => $borrowing->item->available_quantity + $borrowing->quantity
                ]);
            }

            ActivityLogController::makeLog("UPDATE", "Updating status borrowing " . $borrowing->code);
        });

        return back();
    }

    public function report(Request $request)
    {
        $query = Borrowing::with(['item', 'item.category', 'borrower', 'approver', 'uploader'])
            ->filteringByRole()
            ->latest();

        if ($request->has(['start_date', 'end_date'])) {
            $query = $query->when($request->start_date, function ($q) use ($request) {
                $q->where('borrow_date', '>=', $request->start_date);
            })
                ->when($request->end_date, function ($q) use ($request) {
                    $q->where('borrow_date', '<=', $request->end_date);
                });
        }

        if ($request->status && $request->status !== 'all') {
            $query = $query->where('status', $request->status);
        }

        $borrowings = $query->paginate(10);
        return Inertia::render('modules/borrowings/report/page', [
            'borrowings' => $borrowings,
            'user' => Auth::user()
        ]);
    }

    public function exportPdf(Request $request)
    {
        $query = Borrowing::with(['item', 'item.category', 'borrower', 'approver', 'uploader'])
            ->filteringByRole()
            ->latest();

        if ($request->has(['start_date', 'end_date'])) {
            $query = $query->when($request->start_date, function ($q) use ($request) {
                $q->where('borrow_date', '>=', $request->start_date);
            })
                ->when($request->end_date, function ($q) use ($request) {
                    $q->where('borrow_date', '<=', $request->end_date);
                });
        }

        if ($request->status && $request->status !== 'all') {
            $query = $query->where('status', $request->status);
        }

        $pdf = Pdf::loadView('exports.borrowings_report', [
            'borrowings' => $query->get()
        ]);

        $pdf->setPaper('A4', 'landscape');
        return $pdf->download();
    }

}
