<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/admin/users?role=livreur
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', (bool) $request->is_active);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest()->paginate(20));
    }

    // GET /api/admin/users/{user}
    public function show(User $user): JsonResponse
    {
        $user->loadCount(['ordersAsClient', 'ordersAsLivreur']);
        return response()->json($user);
    }

    // POST /api/admin/users — créer un livreur ou admin
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:livreur,admin',
            'phone'    => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => $data['role'],
            'phone'    => $data['phone'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    // PUT /api/admin/users/{user}
    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'sometimes|string|max:100',
            'email'     => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'     => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'role'      => 'sometimes|in:client,livreur,admin',
        ]);

        $user->update($data);

        return response()->json($user);
    }

    // PATCH /api/admin/users/{user}/toggle — activer/désactiver
    public function toggle(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Impossible de désactiver un administrateur.'], 422);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message'   => $user->is_active ? 'Compte activé.' : 'Compte suspendu.',
            'is_active' => $user->is_active,
        ]);
    }

    // GET /api/admin/livreurs/disponibles — liste des livreurs actifs sans mission en cours
    public function livreursDisponibles(): JsonResponse
    {
        $livreurs = User::where('role', 'livreur')
            ->where('is_active', true)
            ->whereDoesntHave('ordersAsLivreur', fn($q) => $q->where('status', 'en_cours'))
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($livreurs);
    }
}
