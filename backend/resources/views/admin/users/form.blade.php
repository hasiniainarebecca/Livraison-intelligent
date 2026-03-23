@extends('admin.layout')
@section('title', $user ? 'Modifier utilisateur' : 'Nouvel utilisateur')
@section('content')
<div class="d-flex align-items-center gap-3 mb-4">
  <a href="{{ route('panel.users.index') }}" class="btn btn-sm btn-outline-secondary">← Retour</a>
  <h4 class="fw-bold mb-0">{{ $user ? 'Modifier : '.$user->name : 'Nouvel utilisateur' }}</h4>
</div>
<div class="card" style="max-width:560px">
  <div class="card-body">
    <form method="POST" action="{{ $user ? route('panel.users.update', $user) : route('panel.users.store') }}">
      @csrf @if($user) @method('PUT') @endif
      <div class="mb-3">
        <label class="form-label">Nom *</label>
        <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name', $user->name ?? '') }}" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="mb-3">
        <label class="form-label">Email *</label>
        <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email', $user->email ?? '') }}" required>
        @error('email')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="mb-3">
        <label class="form-label">Téléphone</label>
        <input type="text" name="phone" class="form-control" value="{{ old('phone', $user->phone ?? '') }}">
      </div>
      <div class="mb-3">
        <label class="form-label">Rôle *</label>
        <select name="role" class="form-select @error('role') is-invalid @enderror" required>
          @foreach(($user ? ['client','livreur','admin'] : ['livreur','admin']) as $r)
          <option value="{{ $r }}" {{ old('role', $user->role ?? 'livreur') == $r ? 'selected' : '' }}>{{ ucfirst($r) }}</option>
          @endforeach
        </select>
        @error('role')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="mb-3">
        <label class="form-label">Mot de passe {{ $user ? '(laisser vide = inchangé)' : '*' }}</label>
        <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" {{ $user ? '' : 'required' }} minlength="8">
        @error('password')<div class="invalid-feedback">{{ $message }}</div>@enderror
      </div>
      <div class="mb-4">
        <label class="form-label">Confirmer le mot de passe</label>
        <input type="password" name="password_confirmation" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">{{ $user ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  </div>
</div>
@endsection
