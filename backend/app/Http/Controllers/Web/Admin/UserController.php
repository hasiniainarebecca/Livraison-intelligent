<?php
namespace App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request) {
        $query = User::latest();
        if ($request->filled('role'))   $query->where('role', $request->role);
        if ($request->filled('search')) $query->where(fn($q) => $q->where('name','like','%'.$request->search.'%')->orWhere('email','like','%'.$request->search.'%'));
        $users = $query->paginate(20)->withQueryString();
        return view('admin.users.index', compact('users'));
    }
    public function create() { return view('admin.users.form', ['user' => null]); }
    public function store(Request $request) {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role'     => 'required|in:livreur,admin',
            'phone'    => 'nullable|string|max:20',
        ]);
        User::create([...$data, 'password' => Hash::make($data['password']), 'is_active' => true]);
        return redirect()->route('panel.users.index')->with('success', 'Utilisateur créé.');
    }
    public function edit(User $user) { return view('admin.users.form', compact('user')); }
    public function update(Request $request, User $user) {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'role'  => 'required|in:client,livreur,admin',
        ]);
        if ($request->filled('password')) {
            $request->validate(['password' => 'min:8|confirmed']);
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);
        return redirect()->route('panel.users.index')->with('success', 'Utilisateur mis à jour.');
    }
    public function toggle(User $user) {
        if ($user->role === 'admin') return back()->with('error', 'Impossible de suspendre un admin.');
        $user->update(['is_active' => !$user->is_active]);
        return back()->with('success', 'Statut modifié.');
    }
}
