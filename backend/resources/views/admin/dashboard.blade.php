@extends('admin.layout')
@section('title', 'Tableau de bord')
@section('content')
<h4 class="fw-bold mb-4">📊 Tableau de bord</h4>

<div class="row g-3 mb-4">
  <div class="col-md-3"><div class="card text-white bg-primary h-100"><div class="card-body"><div class="fs-2 fw-bold">{{ $stats['orders_total'] }}</div><div>Commandes total</div></div></div></div>
  <div class="col-md-3"><div class="card text-white bg-warning h-100"><div class="card-body"><div class="fs-2 fw-bold">{{ $stats['orders_pending'] }}</div><div>En attente</div></div></div></div>
  <div class="col-md-3"><div class="card text-white bg-success h-100"><div class="card-body"><div class="fs-2 fw-bold">{{ number_format($stats['revenue'], 2) }} €</div><div>Revenus (livrées)</div></div></div></div>
  <div class="col-md-3"><div class="card text-white bg-danger h-100"><div class="card-body"><div class="fs-2 fw-bold">{{ $stats['low_stock'] }}</div><div>Stocks bas</div></div></div></div>
</div>

<div class="row g-3 mb-4">
  <div class="col-md-3"><div class="card"><div class="card-body text-center"><div class="fs-3">{{ $stats['products'] }}</div><small class="text-muted">Produits</small></div></div></div>
  <div class="col-md-3"><div class="card"><div class="card-body text-center"><div class="fs-3">{{ $stats['clients'] }}</div><small class="text-muted">Clients</small></div></div></div>
  <div class="col-md-3"><div class="card"><div class="card-body text-center"><div class="fs-3">{{ $stats['livreurs'] }}</div><small class="text-muted">Livreurs</small></div></div></div>
  <div class="col-md-3"><div class="card"><div class="card-body text-center"><div class="fs-3">{{ $stats['orders_ongoing'] }}</div><small class="text-muted">En cours</small></div></div></div>
</div>

<div class="card">
  <div class="card-header fw-semibold">Dernières commandes</div>
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light"><tr><th>#</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Date</th><th></th></tr></thead>
      <tbody>
      @forelse($recent as $order)
      <tr>
        <td>{{ $order->id }}</td>
        <td>{{ $order->client->name ?? '—' }}</td>
        <td>{{ $order->items->count() }} article(s)</td>
        <td>{{ number_format($order->total_price, 2) }} €</td>
        <td><span class="badge bg-{{ $order->status === 'livré' ? 'success' : ($order->status === 'annulée' ? 'secondary' : ($order->status === 'en_cours' ? 'info' : ($order->status === 'validée' ? 'primary' : 'warning'))) }}">{{ $order->status }}</span></td>
        <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
        <td><a href="{{ route('panel.orders.index', ['search' => $order->client->name ?? '']) }}" class="btn btn-sm btn-outline-primary">Voir</a></td>
      </tr>
      @empty
      <tr><td colspan="7" class="text-center text-muted py-4">Aucune commande</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
</div>
@endsection
