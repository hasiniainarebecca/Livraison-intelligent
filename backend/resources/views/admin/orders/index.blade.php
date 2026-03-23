@extends('admin.layout')
@section('title', 'Commandes')
@section('content')
<h4 class="fw-bold mb-3">📦 Commandes</h4>
<form class="row g-2 mb-4" method="GET">
  <div class="col-md-3">
    <select name="status" class="form-select">
      <option value="">Tous les statuts</option>
      @foreach(['en_attente','validée','en_cours','livré','annulée'] as $s)
      <option value="{{ $s }}" {{ request('status') == $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
      @endforeach
    </select>
  </div>
  <div class="col-md-3"><input type="text" name="search" class="form-control" placeholder="Nom client..." value="{{ request('search') }}"></div>
  <div class="col-auto"><button type="submit" class="btn btn-outline-primary">Filtrer</button></div>
  <div class="col-auto"><a href="{{ route('panel.orders.index') }}" class="btn btn-outline-secondary">Reset</a></div>
</form>

<div class="card">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>#</th><th>Client</th><th>Livreur</th><th>Statut</th><th>Paiement</th><th>Total</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
      @forelse($orders as $order)
      @php
        $badge = ['en_attente'=>'warning','validée'=>'primary','en_cours'=>'info','livré'=>'success','annulée'=>'secondary'][$order->status] ?? 'light';
      @endphp
      <tr>
        <td class="fw-semibold">#{{ $order->id }}</td>
        <td>{{ $order->client->name ?? '—' }}<br><small class="text-muted">{{ $order->client->phone ?? '' }}</small></td>
        <td>{!! $order->livreur->name ?? '<span class="text-muted">—</span>' !!}</td>
        <td><span class="badge bg-{{ $badge }}">{{ $order->status }}</span></td>
        <td><span class="badge bg-{{ $order->payment_status === 'paid' ? 'success' : 'danger' }}">{{ $order->payment_status }}</span></td>
        <td>{{ number_format($order->total_price, 2) }} €</td>
        <td>{{ $order->created_at->format('d/m/y H:i') }}</td>
        <td>
          @if($order->status === 'en_attente')
            <form method="POST" action="{{ route('panel.orders.validate', $order) }}" class="d-inline" onsubmit="return confirm('Valider la commande #{{ $order->id }} ?')">
              @csrf @method('PATCH')
              <button type="submit" class="btn btn-sm btn-success">Valider</button>
            </form>
          @endif
          @if(in_array($order->status, ['validée','en_attente']))
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#assignModal{{ $order->id }}">Assigner</button>
          @endif
          @if($order->livreur_id && $order->status !== 'en_cours')
            <form method="POST" action="{{ route('panel.orders.unassign', $order) }}" class="d-inline">
              @csrf @method('PATCH')
              <button type="submit" class="btn btn-sm btn-outline-danger">Retirer</button>
            </form>
          @endif
        </td>
      </tr>

      {{-- Modal Assigner Livreur --}}
      <div class="modal fade" id="assignModal{{ $order->id }}">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Assigner livreur — Commande #{{ $order->id }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <form method="POST" action="{{ route('panel.orders.assign', $order) }}">@csrf @method('PATCH')
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Livreur *</label>
              <select name="livreur_id" class="form-select" required>
                <option value="">-- Choisir --</option>
                @foreach($livreurs as $l)<option value="{{ $l->id }}" {{ $order->livreur_id == $l->id ? 'selected' : '' }}>{{ $l->name }}</option>@endforeach
              </select>
            </div>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button><button type="submit" class="btn btn-primary">Assigner</button></div>
          </form>
        </div></div>
      </div>
      @empty
      <tr><td colspan="8" class="text-center text-muted py-4">Aucune commande</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
  @if($orders->hasPages())<div class="p-3">{{ $orders->links() }}</div>@endif
</div>
@endsection
