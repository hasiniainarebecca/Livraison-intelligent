@extends('admin.layout')
@section('title', 'Stocks')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
  <h4 class="fw-bold mb-0">🏭 Gestion des stocks</h4>
  <a href="{{ request()->fullUrlWithQuery(['low_stock' => request('low_stock') ? null : '1']) }}" class="btn {{ request('low_stock') ? 'btn-danger' : 'btn-outline-danger' }}">
    {{ request('low_stock') ? '✕ Tous les stocks' : '⚠ Stock bas seulement' }}
  </a>
</div>
<div class="card">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>Produit</th><th>Catégorie</th><th>Quantité</th><th>Seuil alerte</th><th>État</th><th>Actions</th></tr></thead>
      <tbody>
      @forelse($stocks as $stock)
      @php $isLow = $stock->quantity <= $stock->alert_threshold; @endphp
      <tr class="{{ $isLow ? 'table-danger' : '' }}">
        <td class="fw-semibold">{{ $stock->product->name ?? '—' }}</td>
        <td>{{ $stock->product->category->name ?? '—' }}</td>
        <td class="fw-bold fs-5 {{ $isLow ? 'text-danger' : 'text-success' }}">{{ $stock->quantity }}</td>
        <td class="text-muted">{{ $stock->alert_threshold }}</td>
        <td><span class="badge bg-{{ $isLow ? 'danger' : 'success' }}">{{ $isLow ? '⚠ Bas' : '✓ OK' }}</span></td>
        <td>
          <button class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#addModal{{ $stock->product_id }}">+ Entrée</button>
          <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#removeModal{{ $stock->product_id }}">− Sortie</button>
          <button class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#adjustModal{{ $stock->product_id }}">⟳ Ajuster</button>
        </td>
      </tr>

      {{-- Modal Entrée --}}
      <div class="modal fade" id="addModal{{ $stock->product_id }}">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">+ Entrée — {{ $stock->product->name }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <form method="POST" action="{{ route('panel.stocks.add', $stock->product_id) }}">@csrf
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Quantité *</label><input type="number" name="quantity" class="form-control" min="1" required></div>
            <div class="mb-3"><label class="form-label">Note</label><input type="text" name="note" class="form-control" placeholder="Optionnel"></div>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button><button type="submit" class="btn btn-success">Valider</button></div>
          </form>
        </div></div>
      </div>

      {{-- Modal Sortie --}}
      <div class="modal fade" id="removeModal{{ $stock->product_id }}">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">− Sortie — {{ $stock->product->name }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <form method="POST" action="{{ route('panel.stocks.remove', $stock->product_id) }}">@csrf
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Quantité * (max : {{ $stock->quantity }})</label><input type="number" name="quantity" class="form-control" min="1" max="{{ $stock->quantity }}" required></div>
            <div class="mb-3"><label class="form-label">Note</label><input type="text" name="note" class="form-control" placeholder="Optionnel"></div>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button><button type="submit" class="btn btn-warning">Valider</button></div>
          </form>
        </div></div>
      </div>

      {{-- Modal Ajustement --}}
      <div class="modal fade" id="adjustModal{{ $stock->product_id }}">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">⟳ Ajuster — {{ $stock->product->name }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <form method="POST" action="{{ route('panel.stocks.adjust', $stock->product_id) }}">@csrf
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Nouveau total *</label><input type="number" name="new_quantity" class="form-control" min="0" value="{{ $stock->quantity }}" required></div>
            <div class="mb-3"><label class="form-label">Seuil d'alerte</label><input type="number" name="alert_threshold" class="form-control" min="0" value="{{ $stock->alert_threshold }}"></div>
            <div class="mb-3"><label class="form-label">Note</label><input type="text" name="note" class="form-control" placeholder="Optionnel"></div>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button><button type="submit" class="btn btn-secondary">Ajuster</button></div>
          </form>
        </div></div>
      </div>
      @empty
      <tr><td colspan="6" class="text-center text-muted py-4">Aucun stock</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
  @if($stocks->hasPages())<div class="p-3">{{ $stocks->links() }}</div>@endif
</div>
@endsection
