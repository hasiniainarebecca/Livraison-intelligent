<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'Admin') — Porte Ouverte</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
  body { background: #f8f9fa; }
  .sidebar { width: 240px; min-height: 100vh; background: #1e293b; color: #cbd5e1; position: fixed; top: 0; left: 0; z-index: 100; }
  .sidebar .brand { padding: 20px 16px 16px; font-size: 1.1rem; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #334155; }
  .sidebar .nav-link { color: #94a3b8; padding: 10px 20px; border-radius: 0; display: flex; align-items: center; gap: 10px; font-size: 0.875rem; }
  .sidebar .nav-link:hover, .sidebar .nav-link.active { background: #334155; color: #fff; }
  .sidebar .nav-section { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; padding: 12px 20px 4px; }
  .main-content { margin-left: 240px; padding: 24px; }
  .topbar { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
</style>
</head>
<body>
<div class="sidebar d-flex flex-column">
  <div class="brand">🚪 Porte Ouverte</div>
  <nav class="flex-grow-1 pt-2">
    <div class="nav-section">Général</div>
    <a href="{{ route('panel.dashboard') }}" class="nav-link {{ request()->routeIs('panel.dashboard') ? 'active' : '' }}">📊 Tableau de bord</a>
    <div class="nav-section">Gestion</div>
    <a href="{{ route('panel.orders.index') }}" class="nav-link {{ request()->routeIs('panel.orders.*') ? 'active' : '' }}">📦 Commandes</a>
    <a href="{{ route('panel.products.index') }}" class="nav-link {{ request()->routeIs('panel.products.*') ? 'active' : '' }}">🛍 Produits</a>
    <a href="{{ route('panel.categories.index') }}" class="nav-link {{ request()->routeIs('panel.categories.*') ? 'active' : '' }}">🗂 Catégories</a>
    <a href="{{ route('panel.stocks.index') }}" class="nav-link {{ request()->routeIs('panel.stocks.*') ? 'active' : '' }}">🏭 Stocks</a>
    <div class="nav-section">Utilisateurs</div>
    <a href="{{ route('panel.users.index') }}" class="nav-link {{ request()->routeIs('panel.users.*') ? 'active' : '' }}">👥 Utilisateurs</a>
  </nav>
  <div class="p-3 border-top border-secondary">
    <small class="text-muted d-block mb-1">{{ Auth::user()->name }}</small>
    <form method="POST" action="{{ route('panel.logout') }}">@csrf
      <button type="submit" class="btn btn-sm btn-outline-secondary w-100">Déconnexion</button>
    </form>
  </div>
</div>

<div class="main-content">
  @if(session('success'))<div class="alert alert-success alert-dismissible fade show mb-4" role="alert">{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>@endif
  @if(session('error'))<div class="alert alert-danger alert-dismissible fade show mb-4" role="alert">{{ session('error') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>@endif
  @yield('content')
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
@stack('scripts')
</body>
</html>
