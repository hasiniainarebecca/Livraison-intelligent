<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Client\ProductController as ClientProductController;
use App\Http\Controllers\Livreur\LocationController;
use App\Http\Controllers\Livreur\OrderController as LivreurOrderController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StockController as AdminStockController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use Illuminate\Support\Facades\Route;

// ─── AUTH (public) ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});

// ─── CATALOGUE PUBLIC (lecture seule) ─────────────────────────────────────────
Route::get('categories',           [CategoryController::class, 'index']);
Route::get('products',             [ClientProductController::class, 'index']);
Route::get('products/{product}',   [ClientProductController::class, 'show']);

// ─── NOTIFICATIONS (tous rôles connectés) ─────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('notifications')->group(function () {
    Route::get('/',             [NotificationController::class, 'index']);
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/{id}/read',  [NotificationController::class, 'markRead']);
    Route::post('/read-all',    [NotificationController::class, 'markAllRead']);
});

// ─── CLIENT ───────────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:client'])->prefix('client')->group(function () {
    Route::post('payment/create-intent',  [PaymentController::class, 'createIntent']);
    Route::get('orders',                  [ClientOrderController::class, 'index']);
    Route::post('orders',                 [ClientOrderController::class, 'store']);
    Route::get('orders/{order}',          [ClientOrderController::class, 'show']);
    Route::patch('orders/{order}/cancel', [ClientOrderController::class, 'cancel']);
});

// ─── LIVREUR ──────────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:livreur'])->prefix('livreur')->group(function () {
    Route::get('orders',                   [LivreurOrderController::class, 'index']);
    Route::get('orders/{order}',           [LivreurOrderController::class, 'show']);
    Route::put('orders/{order}/start',     [LivreurOrderController::class, 'start']);
    Route::put('orders/{order}/deliver',   [LivreurOrderController::class, 'deliver']);
    Route::post('orders/{order}/location', [LocationController::class, 'update']);
});

// ─── ADMIN (seul rôle autorisé pour toutes les opérations d'écriture) ─────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // ── Commandes ─────────────────────────────────────────────────────────────
    Route::get('orders',                      [AdminOrderController::class, 'index']);
    Route::put('orders/{order}/validate',     [AdminOrderController::class, 'validateOrder']);
    Route::put('orders/{order}/assign',       [AdminOrderController::class, 'assign']);
    Route::delete('orders/{order}/unassign',  [AdminOrderController::class, 'unassign']); // retirer mission
    Route::get('reports',                     [AdminOrderController::class, 'reports']);

    // ── Catégories (CRUD complet — admin uniquement) ──────────────────────────
    Route::post('categories',              [CategoryController::class, 'store']);
    Route::put('categories/{category}',    [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    // ── Produits (CRUD complet — admin uniquement) ────────────────────────────
    Route::get('products',                    [AdminProductController::class, 'index']);
    Route::post('products',                   [AdminProductController::class, 'store']);
    Route::get('products/{product}',          [AdminProductController::class, 'show']);
    Route::put('products/{product}',          [AdminProductController::class, 'update']);
    Route::delete('products/{product}',       [AdminProductController::class, 'destroy']);
    Route::patch('products/{product}/toggle', [AdminProductController::class, 'toggle']);

    // ── Stocks (CRUD + mouvements — admin uniquement) ─────────────────────────
    Route::get('stocks',                          [AdminStockController::class, 'index']);
    Route::get('stocks/alerts',                   [AdminStockController::class, 'alerts']);
    Route::get('stocks/movements',                [AdminStockController::class, 'movements']);
    Route::get('stocks/{product}',                [AdminStockController::class, 'show']);
    Route::post('stocks/{product}/add',           [AdminStockController::class, 'add']);
    Route::post('stocks/{product}/remove',        [AdminStockController::class, 'remove']);
    Route::post('stocks/{product}/adjust',        [AdminStockController::class, 'adjust']);

    // ── Utilisateurs (CRUD — admin uniquement) ────────────────────────────────
    Route::get('users',                   [AdminUserController::class, 'index']);
    Route::post('users',                  [AdminUserController::class, 'store']);
    Route::get('users/{user}',            [AdminUserController::class, 'show']);
    Route::put('users/{user}',            [AdminUserController::class, 'update']);
    Route::patch('users/{user}/toggle',   [AdminUserController::class, 'toggle']);
    Route::get('livreurs/disponibles',    [AdminUserController::class, 'livreursDisponibles']);
});
