<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
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

Route::get('/{any}', function () {
    $path = public_path('index.html');
    abort_unless(file_exists($path), 404);
    return response(File::get($path), 200)
        ->header('Content-Type', 'text/html');
})->where('any', '^(?!api)(?!static)(?!.*\.(js|css|png|jpg|jpeg|svg|json|ico)).*$');

