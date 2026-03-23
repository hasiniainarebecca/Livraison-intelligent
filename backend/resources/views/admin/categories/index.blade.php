@extends('admin.layout')
@section('title', 'Catégories')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="fw-bold mb-0">🗂 Catégories</h4>
  <a href="{{ route('panel.categories.create') }}" class="btn btn-primary">+ Nouvelle catégorie</a>
</div>
<div class="card">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>Icône</th><th>Nom</th><th>Slug</th><th>Produits</th><th>Actif</th><th>Actions</th></tr></thead>
      <tbody>
      @forelse($categories as $cat)
      <tr>
        <td style="font-size:1.5rem">{{ $cat->icon }}</td>
        <td class="fw-semibold">{{ $cat->name }}</td>
        <td><code>{{ $cat->slug }}</code></td>
        <td>{{ $cat->products_count }}</td>
        <td><span class="badge bg-{{ $cat->is_active ? 'success' : 'secondary' }}">{{ $cat->is_active ? 'Actif' : 'Inactif' }}</span></td>
        <td>
          <a href="{{ route('panel.categories.edit', $cat) }}" class="btn btn-sm btn-outline-secondary">Modifier</a>
          <form method="POST" action="{{ route('panel.categories.destroy', $cat) }}" class="d-inline" onsubmit="return confirm('Supprimer cette catégorie ?')">
            @csrf @method('DELETE')
            <button type="submit" class="btn btn-sm btn-outline-danger">Supprimer</button>
          </form>
        </td>
      </tr>
      @empty
      <tr><td colspan="6" class="text-center text-muted py-4">Aucune catégorie</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
</div>
@endsection
