<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ReturnItemController;
use App\Http\Controllers\UserController;
use App\Models\Borrowing;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['guest']], function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
});
