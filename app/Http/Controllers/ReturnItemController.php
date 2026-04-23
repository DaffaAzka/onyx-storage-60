<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Item;
use App\Models\ReturnItem;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturnItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Borrowing::with(['approver', 'borrower', 'item.category', 'returnItem'])
            ->where(function ($q) {
                $q->whereIn('status', ['borrowed', 'late', 'returned'])
                    ->where(function ($q) {
                        $q->doesntHave('returnItem')
                            ->orWhereHas('returnItem', function ($q) {
                                $q->whereNull('verified_at');
                            });
                    });
            })
            ->filteringByRole()
            ->latest();

        if ($request->search && $request->search) {
            $query = $query->whereHas('item', function ($q) use ($request) {
                $q->where('name', 'like', "%$request->search%")
                    ->orWhere('code', 'like', "%$request->search%")
                    ->orWhere('description', 'like', "%$request->search%");
            });
        }

        $borrowings = $query->paginate(10);
        $return_items = ReturnItem::with(['borrowing', 'borrowing.item', 'borrowing.borrower', 'received'])->filteringByRole()->where('fine_paid', 0)->get();

        return Inertia::render("modules/return-items/page", [
            "borrowings" => $borrowings,
            "return_items" => $return_items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'borrowing_id' => 'required|exists:borrowings,id',
            'return_date' => 'required|date',
            'condition' => 'required|in:fair,damaged,good',
            'fine_amount' => 'nullable|numeric|min:0',
            'fine_paid' => 'boolean',
            'notes' => 'nullable|string',
            'image_path' => 'required|required_if:status,borrowed|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $user = Auth::user();

            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $path = $file->store('return-items', 'public');
                $image_path = $path;
                $request['upload_by'] = Auth::id();
                $request['upload_at'] = now();
            }

            $borrowing = Borrowing::with('item')->findOrFail($request->borrowing_id);
            $borrowing->status = $borrowing->planned_return_date < now() ? 'late' : 'returned';
            $borrowing->actual_return_date = $request->return_date;
            $borrowing->save();

            ReturnItem::create([
                'borrowing_id' => $request->borrowing_id,
                'return_date' => $request->return_date,
                'condition' => $request->condition,
                'fine_amount' => $request->fine_amount,
                'received_by' => $user->role !== "user" ? $user->id : null,
                'fine_paid' => $request->fine_amount == 0 ? 1 : $request->fine_paid,
                'notes' => $request->notes,
                'image_path' => $image_path ?? null,
                'verified_at' => $user->role !== 'user' ? now() : null,
                'upload_by' => $request->upload_by ?? null,
                'upload_at' => $request->upload_at ?? null,
            ]);

            $item = Item::findOrFail($borrowing->item->id);
            $parentId = $item->ref_item_id ?? $item->id;

            if ($item->status !== $request->condition) {
                $item->quantity -= $borrowing->quantity;
                $item->save();

                $existingItem = Item::where('ref_item_id', $parentId)
                    ->where('status', $request->condition)
                    ->first();

                if ($existingItem) {
                    $existingItem->quantity += $borrowing->quantity;
                    $existingItem->available_quantity += $borrowing->quantity;
                    $existingItem->save();
                } else {
                    Item::create([
                        'name' => $item->name . ' (' . $request->condition . ')',
                        'description' => $item->description,
                        'category_id' => $item->category_id,
                        'quantity' => $borrowing->quantity,
                        'available_quantity' => $borrowing->quantity,
                        'code' => $item->code . '-' . $request->condition,
                        'user_id' => Auth::id(),
                        'image_path' => $image_path ?? $item->image_path,
                        'ref_item_id' => $parentId,
                    ]);
                }

            } else {
                $item->available_quantity += $borrowing->quantity;
                $item->save();
            }

            ActivityLogController::makeLog("CREATE", "Returning Borrowing " . $borrowing->code);
        });

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $query = ReturnItem::with(['borrowing', 'borrowing.item', 'borrowing.borrower', 'received', 'uploader'])->whereNotNull('verified_at')->filteringByRole();

        if ($request->search && $request->search) {
            $query->whereHas('borrowing.item', function ($q) use ($request) {
                $q->where('name', 'like', "%$request->search%")
                    ->orWhere('code', 'like', "%$request->search%")
                    ->orWhere('description', 'like', "%$request->search%");
            })->orWhereHas('borrowing.borrower', function ($q) use ($request) {
                $q->where('name', 'like', "%$request->search%")->orWhere('email', 'like', "%$request->search%");
            });
        }

        $return_items = $query->paginate(10);

        return Inertia::render("modules/return-items/list/page", [
            "return_items" => $return_items
        ]);
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
    public function update(Request $request)
    {
        $request->validate([
            'return_item_id' => 'required',
            'fine_amount' => 'nullable|numeric|min:0',
            'fine_paid' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $return = ReturnItem::findOrFail($request->return_item_id);
            $return->update([
                'fine_amount' => $request->fine_amount,
                'fine_paid' => $request->fine_paid,
                'notes' => $request->notes,
            ]);
            ActivityLogController::makeLog("UPDATE", "Updating Return Item ");
        });



        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function verify(string $id)
    {
        $user = auth()->user();
        $return = ReturnItem::findOrFail($id);
        if (($return->approve_at == null || $return->approve_at == '') && $user->role !== "user") {
            $return->update([
                'verified_at' => now()
            ]);
        }

        return back();
    }

    public function report(Request $request)
    {
        $query = ReturnItem::with(['borrowing', 'borrowing.item', 'borrowing.item.category', 'borrowing.borrower', 'received'])
            ->filteringByRole();

        if ($request->condition && $request->condition !== 'all') {
            $query = $query->where('condition', $request->condition);
        }

        if ($request->has(['start_date', 'end_date'])) {
            $query = $query->when($request->start_date, function ($q) use ($request) {
                $q->where('return_date', '>=', $request->start_date);
            })
                ->when($request->end_date, function ($q) use ($request) {
                    $q->where('return_date', '<=', $request->end_date);
                });
        }

        $return_items = $query->paginate(10);

        return Inertia::render('modules/return-items/report/page', [
            'return_items' => $return_items,
            'user' => Auth::user()
        ]);
    }

    public function exportPdf(Request $request)
    {
        $query = ReturnItem::with(['borrowing', 'borrowing.item', 'borrowing.item.category', 'borrowing.borrower', 'received'])->
            filteringByRole();

        if ($request->has(['start_date', 'end_date'])) {
            $query = $query->when($request->start_date, function ($q) use ($request) {
                $q->where('return_date', '>=', $request->start_date);
            })
                ->when($request->end_date, function ($q) use ($request) {
                    $q->where('return_date', '<=', $request->end_date);
                });
        }

        if ($request->condition && $request->condition !== 'all') {
            $query = $query->where('condition', $request->condition);
        }

        $pdf = Pdf::loadView('exports.return_items_report', [
            'return_items' => $query->get()
        ]);

        $pdf->setPaper('A4', 'landscape');
        return $pdf->download();

    }
}
