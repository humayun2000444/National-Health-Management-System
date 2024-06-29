<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/index', function () {
    return view('index');
});

Route::get('/about', function () {
    return view('about');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::get('/doctors', function () {
    return view('doctors');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');



use App\Http\Controllers\AppointmentController;

Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

// Protect appointment routes
Route::middleware('auth')->group(function () {
    Route::get('/appointment', [AppointmentController::class, 'create'])->name('appointments.create');
    Route::post('/appointment', [AppointmentController::class, 'store'])->name('appointments.store');
});
