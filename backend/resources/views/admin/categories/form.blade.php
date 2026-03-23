@extends('admin.layout')
@section('title', $category ? 'Modifier catégorie' : 'Nouvelle catégorie')
@section('content')
<div class="d-flex align-items-center gap-3 mb-4">
  <a href="{{ route('panel.categories.index') }}" class="btn btn-sm btn-outline-secondary">← Retour</a>
  <h4 class="fw-bold mb-0">{{ $category ? 'Modifier : '.$category->name : 'Nouvelle catégorie' }}</h4>
</div>
<div class="card" style="max-width:600px">
  <div class="card-body">
    <form method="POST" action="{{ $category ? route('panel.categories.update', $category) : route('panel.categories.store') }}">
      @csrf
      @if($category) @method('PUT') @endif
      <div class="mb-3">
        <label class="form-label">Nom *</label>
        <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name', $category->name ?? '') }}" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="row g-3 mb-3">
        <div class="col-4">
          <label class="form-label">Icône (emoji)</label>
          <input type="text" name="icon" class="form-control" value="{{ old('icon', $category->icon ?? '') }}" placeholder="📦">
        </div>
        <div class="col-8">
          <label class="form-label">Couleur (hex)</label>
          <div class="input-group">
            <input type="color" name="color" class="form-control form-control-color" value="{{ old('color', $category->color ?? '#3B82F6') }}">
            <input type="text" class="form-control" value="{{ old('color', $category->color ?? '#3B82F6') }}" readonly>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description', $category->description ?? '') }}</textarea>
      </div>
      <div class="mb-4 form-check">
        <input type="checkbox" name="is_active" class="form-check-input" id="is_active" value="1" {{ old('is_active', $category->is_active ?? true) ? 'checked' : '' }}>
        <label class="form-check-label" for="is_active">Catégorie active</label>
      </div>
      <button type="submit" class="btn btn-primary">{{ $category ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  </div>
</div>
@endsection
