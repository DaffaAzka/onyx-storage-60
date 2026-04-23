<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::all();

        $query = Item::with(['category', 'user']);

        if ($request->search) {
            $query->where('name', 'like', "%$request->search%")->orWhere('description', 'like', "%$request->search%");
        }

        if ($request->category_id) {
            $query->where('category_id', 'like', '%' . $request->category_id . '%');
        }

        $items = $query->paginate(10);
        return Inertia::render('modules/items/page', [
            'categories' => $categories,
            'items' => $items
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
        //
        $request->validate([
            'name' => 'required|string',
            'status' => 'required|string',
            'description' => 'nullable|string',
            'code' => 'required|string|unique:items,code',
            'category_id' => 'required|exists:categories,id',
            'quantity' => 'required|integer|min:0',
            'available_quantity' => 'required|integer|min:0',
            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request;

        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $path = $file->store('items', 'public');
            $data['path'] = $path;
        }

        Item::create([
            'name' => $data['name'],
            'status' => $data['status'],
            'description' => $data['description'],
            'code' => $data['code'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'available_quantity' => $data['available_quantity'],
            'image_path' => $data['path'],
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
            'status' => 'required|string',
            'description' => 'nullable|string',
            'code' => 'required|string|unique:items,code,' . $id,
            'category_id' => 'required|exists:categories,id',
            'quantity' => 'required|integer|min:0',
            'available_quantity' => 'required|integer|min:0',
            'image_path' => 'nullable'
        ]);

        $item = Item::findOrFail($id);

        $data = $request->all();

        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $path = $file->store('items', 'public');
            $data['path'] = $path;

            if ($item->image_path) {
                $this->removeImg($item->image_path);
            }
        } else {
            $data['path'] = $item->image_path;
        }

        $item->update([
            'name' => $data['name'],
            'status' => $data['status'],
            'description' => $data['description'],
            'code' => $data['code'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'available_quantity' => $data['available_quantity'],
            'image_path' => $data['path'],
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Item::with('borrowings')->findOrFail($id);

        if ($item->borrowings()->whereIn('status', ['borrowed', 'pending', 'approved'])->exists()) {
            return back()->withErrors(['message' => 'Cannot delete item because the item still had transaction.']);
        } else {
            if ($item->image_path) {
                $this->removeImg($item->image_path);
            }

            $item->delete();
        }

        return back();
    }

    public function removeImg(string $path)
    {
        $c = Item::where('image_path', $path)->count();
        if ($c == 1) {
            Storage::disk('public')->delete($path);
        }
    }
}
