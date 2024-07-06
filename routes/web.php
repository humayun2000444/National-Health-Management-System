<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\HomeController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
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


Route::get('admin/calander', function () {
    return view('admin.calander');
});

Route::get('admin/appoinments', function () {
    return view('admin.appoinments');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';



// Admin 
Route::namespace('Admin')->prefix('admin')->name('admin.')->group(function(){
    Route::namespace('Auth')->middleware('guest:admin')->group(function(){
        // login route
        Route::get('login','AuthenticatedSessionController@create')->name('login');
        Route::post('login','AuthenticatedSessionController@store')->name('adminlogin');
    });
    Route::middleware('admin')->group(function(){
        Route::get('dashboard','HomeController@index')->name('dashboard');

        Route::get('admin-test','HomeController@adminTest')->name('admintest');
        Route::get('editor-test','HomeController@editorTest')->name('editortest');

        Route::resource('posts','PostController');

    });
    Route::post('logout','Auth\AuthenticatedSessionController@destroy')->name('logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/appointments', [AppointmentController::class, 'userAppointments'])->name('appointments.index');
    Route::get('/appointment/create', [AppointmentController::class, 'create'])->name('appointments.create');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
});







