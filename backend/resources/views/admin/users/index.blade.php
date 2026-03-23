@extends('admin.layout')
@section('title', 'Utilisateurs')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
  <h4 class="fw-bold mb-0">👥 Utilisateurs</h4>
  <a href="{{ route('panel.users.create') }}" class="btn btn-primary">+ Nouvel utilisateur</a>
</div>
<form class="row g-2 mb-4" method="GET">
  <div class="col-md-3">
    <select name="role" class="form-select">
      <option value="">Tous les rôles</option>
      @foreach(['client','livreur','admin'] as $r)
      <option value="{{ $r }}" {{ request('role') == $r ? 'selected' : '' }}>{{ ucfirst($r) }}</option>
      @endforeach
    </select>
  </div>
  <div class="col-md-3"><input type="text" name="search" class="form-control" placeholder="Nom ou email..." value="{{ request('search') }}"></div>
  <div class="col-auto"><button type="submit" class="btn btn-outline-primary">Filtrer</button></div>
  <div class="col-auto"><a href="{{ route('panel.users.index') }}" class="btn btn-outline-secondary">Reset</a></div>
</form>
<div class="card">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
      @forelse($users as $user)
      <tr class="{{ !$user->is_active ? 'text-muted' : '' }}">
        <td class="fw-semibold">{{ $user->name }}</td>
        <td>{{ $user->email }}</td>
        <td>{{ $user->phone ?? '—' }}</td>
        <td><span class="badge bg-{{ ['admin'=>'danger','livreur'=>'info','client'=>'primary'][$user->role] ?? 'secondary' }}">{{ $user->role }}</span></td>
        <td><span class="badge bg-{{ $user->is_active ? 'success' : 'secondary' }}">{{ $user->is_active ? 'Actif' : 'Suspendu' }}</span></td>
        <td>
          <a href="{{ route('panel.users.edit', $user) }}" class="btn btn-sm btn-outline-secondary">Modifier</a>
          @if($user->role !== 'admin')
          <form method="POST" action="{{ route('panel.users.toggle', $user) }}" class="d-inline">@csrf @method('PATCH')
            <button type="submit" class="btn btn-sm btn-outline-{{ $user->is_active ? 'warning' : 'success' }}">{{ $user->is_active ? 'Suspendre' : 'Activer' }}</button>
          </form>
          @endif
        </td>
      </tr>
      @empty
      <tr><td colspan="6" class="text-center text-muted py-4">Aucun utilisateur</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
  @if($users->hasPages())<div class="p-3">{{ $users->links() }}</div>@endif
</div>
@endsection
