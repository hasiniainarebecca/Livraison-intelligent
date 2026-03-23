<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminWeb
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('panel.login')
                ->with('error', 'Connectez-vous avec un compte administrateur.');
        }

        return $next($request);
    }
}
