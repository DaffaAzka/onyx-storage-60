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

    Route::get('/register', [AuthController::class, 'register']);
    Route::get('/login', [AuthController::class, 'login'])->name('login');

    Route::post('/register', [AuthController::class, 'registerRequest']);
    Route::post('/login', [AuthController::class, 'loginRequest']);
});

Route::group(['middleware' => ['auth']], function() {


    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::patch('/my-profile', [AuthController::class, 'update']);

    Route::prefix('/borrowings')->group(function () {
        Route::get('/', [BorrowingController::class, 'index']);
        Route::get('/create', [BorrowingController::class, 'create']);
    });;

    Route::group(['middleware' => ['role:admin']], function () {

        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::patch('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::get('/items', [ItemController::class, 'index']);
        Route::post('/items', [ItemController::class, 'store']);
        Route::post('/items/{id}', [ItemController::class, 'update']);
        Route::delete('/items/{id}', [ItemController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

    });

});
