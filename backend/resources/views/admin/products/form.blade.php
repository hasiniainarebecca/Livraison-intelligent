@extends('admin.layout')
@section('title', $product ? 'Modifier produit' : 'Nouveau produit')
@section('content')
<div class="d-flex align-items-center gap-3 mb-4">
  <a href="{{ route('panel.products.index') }}" class="btn btn-sm btn-outline-secondary">← Retour</a>
  <h4 class="fw-bold mb-0">{{ $product ? 'Modifier : '.$product->name : 'Nouveau produit' }}</h4>
</div>
<div class="card" style="max-width:640px">
  <div class="card-body">
    <form method="POST" action="{{ $product ? route('panel.products.update', $product) : route('panel.products.store') }}">
      @csrf @if($product) @method('PUT') @endif
      <div class="mb-3">
        <label class="form-label">Catégorie *</label>
        <select name="category_id" class="form-select @error('category_id') is-invalid @enderror" required>
          <option value="">-- Choisir --</option>
          @foreach($categories as $cat)<option value="{{ $cat->id }}" {{ old('category_id', $product->category_id ?? '') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>@endforeach
        </select>
        @error('category_id')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="mb-3">
        <label class="form-label">Nom *</label>
        <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name', $product->name ?? '') }}" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="row g-3 mb-3">
        <div class="col-6">
          <label class="form-label">Prix (€) *</label>
          <input type="number" name="price" step="0.01" min="0" class="form-control @error('price') is-invalid @enderror" value="{{ old('price', $product->price ?? '') }}" required>
          @error('price')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
        <div class="col-6">
          <label class="form-label">Poids (kg) *</label>
          <input type="number" name="weight_kg" step="0.01" min="0" class="form-control @error('weight_kg') is-invalid @enderror" value="{{ old('weight_kg', $product->weight_kg ?? '') }}" required>
          @error('weight_kg')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="4">{{ old('description', $product->description ?? '') }}</textarea>
      </div>
      <div class="mb-4 form-check">
        <input type="checkbox" name="is_active" class="form-check-input" id="is_active" value="1" {{ old('is_active', $product->is_active ?? true) ? 'checked' : '' }}>
        <label class="form-check-label" for="is_active">Produit actif</label>
      </div>
      <button type="submit" class="btn btn-primary">{{ $product ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  </div>
</div>
@endsection
