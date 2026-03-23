<?php
use App\Http\Controllers\Web\Admin\AuthController as PanelAuthController;
use App\Http\Controllers\Web\Admin\DashboardController;
use App\Http\Controllers\Web\Admin\CategoryController as PanelCategoryController;
use App\Http\Controllers\Web\Admin\ProductController as PanelProductController;
use App\Http\Controllers\Web\Admin\StockController as PanelStockController;
use App\Http\Controllers\Web\Admin\OrderController as PanelOrderController;
use App\Http\Controllers\Web\Admin\UserController as PanelUserController;
use Illuminate\Support\Facades\Route;

// Auth panel
Route::get('/panel/login',  [PanelAuthController::class, 'showLogin'])->name('panel.login');
Route::post('/panel/login', [PanelAuthController::class, 'login'])->name('panel.login.post');
Route::post('/panel/logout',[PanelAuthController::class, 'logout'])->name('panel.logout')->middleware('admin.web');

// Panel admin (protected)
Route::middleware('admin.web')->prefix('panel')->name('panel.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', PanelCategoryController::class)->except(['show']);
    Route::resource('products',   PanelProductController::class)->except(['show']);
    Route::patch('products/{product}/toggle', [PanelProductController::class, 'toggle'])->name('products.toggle');

    Route::get('stocks',                   [PanelStockController::class, 'index'])->name('stocks.index');
    Route::post('stocks/{product}/add',    [PanelStockController::class, 'add'])->name('stocks.add');
    Route::post('stocks/{product}/remove', [PanelStockController::class, 'remove'])->name('stocks.remove');
    Route::post('stocks/{product}/adjust', [PanelStockController::class, 'adjust'])->name('stocks.adjust');

    Route::get('orders',                          [PanelOrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/validate',       [PanelOrderController::class, 'validate'])->name('orders.validate');
    Route::patch('orders/{order}/assign',         [PanelOrderController::class, 'assign'])->name('orders.assign');
    Route::patch('orders/{order}/unassign',       [PanelOrderController::class, 'unassign'])->name('orders.unassign');

    Route::resource('users', PanelUserController::class)->except(['show', 'destroy']);
    Route::patch('users/{user}/toggle', [PanelUserController::class, 'toggle'])->name('users.toggle');
});

// Fallback: redirect root to panel
Route::get('/', fn() => redirect('/panel'));
