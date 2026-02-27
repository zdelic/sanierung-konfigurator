<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PricebookController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\KalkulationController;

// PUBLIC
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/pricebook', [PricebookController::class, 'index']);

Route::get('/kalkulationen', [KalkulationController::class, 'index']);
Route::post('/kalkulationen', [KalkulationController::class, 'store']);
Route::get('/kalkulationen/{kalkulation}', [KalkulationController::class, 'show']);
Route::put('/kalkulationen/{kalkulation}', [KalkulationController::class, 'update']);
Route::delete('/kalkulationen/{kalkulation}', [KalkulationController::class, 'destroy']);
Route::get('/kalkulationen/{kalkulation}/pdf', [KalkulationController::class, 'pdf']);

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // pricebook read (svaki logirani)

    // pricebook write (admin/permission)
    Route::middleware('permission:pricebook.edit')->group(function () {
        Route::put('/pricebook/items/{item}', [PricebookController::class, 'update']);
        Route::post('/pricebook/bulk', [PricebookController::class, 'bulk']);
    });

    // projects (edit)
    Route::middleware('permission:projects.edit')->group(function () {
        Route::post('/projects', [ProjectsController::class, 'store']);
        Route::get('/projects/{project}', [ProjectsController::class, 'show']);
        Route::put('/projects/{project}', [ProjectsController::class, 'update']);
    });

    // projects delete
    Route::middleware('permission:projects.delete')->delete('/projects/{project}', [ProjectsController::class, 'destroy']);
});
