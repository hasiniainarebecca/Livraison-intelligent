@extends('admin.layout')
@section('title', 'Produits')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
  <h4 class="fw-bold mb-0">🛍 Produits</h4>
  <a href="{{ route('panel.products.create') }}" class="btn btn-primary">+ Nouveau produit</a>
</div>
<form class="row g-2 mb-4" method="GET">
  <div class="col-md-4">
    <input type="text" name="search" class="form-control" placeholder="Rechercher par nom..." value="{{ request('search') }}">
  </div>
  <div class="col-md-3">
    <select name="category_id" class="form-select">
      <option value="">Toutes catégories</option>
      @foreach($categories as $cat)<option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>@endforeach
    </select>
  </div>
  <div class="col-auto"><button type="submit" class="btn btn-outline-primary">Filtrer</button></div>
  <div class="col-auto"><a href="{{ route('panel.products.index') }}" class="btn btn-outline-secondary">Réinitialiser</a></div>
</form>
<div class="card">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Poids</th><th>Stock</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
      @forelse($products as $product)
      <tr class="{{ $product->is_active ? '' : 'text-muted' }}">
        <td class="fw-semibold">{{ $product->name }}</td>
        <td>{{ $product->category->name ?? '—' }}</td>
        <td>{{ number_format($product->price, 2) }} €</td>
        <td>{{ $product->weight_kg }} kg</td>
        <td>
          @if($product->stock)
            <span class="badge bg-{{ $product->stock->quantity <= $product->stock->alert_threshold ? 'danger' : 'success' }}">
              {{ $product->stock->quantity }}
            </span>
          @else <span class="text-muted">—</span> @endif
        </td>
        <td><span class="badge bg-{{ $product->is_active ? 'success' : 'secondary' }}">{{ $product->is_active ? 'Actif' : 'Inactif' }}</span></td>
        <td>
          <a href="{{ route('panel.products.edit', $product) }}" class="btn btn-sm btn-outline-secondary">Modifier</a>
          <form method="POST" action="{{ route('panel.products.toggle', $product) }}" class="d-inline">@csrf @method('PATCH')
            <button type="submit" class="btn btn-sm btn-outline-{{ $product->is_active ? 'warning' : 'success' }}">{{ $product->is_active ? 'Désactiver' : 'Activer' }}</button>
          </form>
          <form method="POST" action="{{ route('panel.products.destroy', $product) }}" class="d-inline" onsubmit="return confirm('Supprimer ?')">@csrf @method('DELETE')
            <button type="submit" class="btn btn-sm btn-outline-danger">Suppr.</button>
          </form>
        </td>
      </tr>
      @empty
      <tr><td colspan="7" class="text-center text-muted py-4">Aucun produit</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
  @if($products->hasPages())<div class="p-3">{{ $products->links() }}</div>@endif
</div>
@endsection
