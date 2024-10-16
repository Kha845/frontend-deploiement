<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

Route::get('/', function () {
    return view('welcome');
});
//la gestion de l'authentification des utilisateurs
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('/login', [AuthController::class,'login']);
    Route::post('logout', [AuthController::class,'logout']);
    Route::get('me', [AuthController::class,'me']);

});