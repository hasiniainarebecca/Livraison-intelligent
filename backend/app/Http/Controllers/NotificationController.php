<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications — notifications de l'utilisateur connecté
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->with('order:id,status,type')
            ->latest('sent_at')
            ->paginate(20);

        return response()->json($notifications);
    }

    // GET /api/notifications/unread-count
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()->notifications()->where('is_read', false)->count();

        return response()->json(['count' => $count]);
    }

    // PATCH /api/notifications/{id}/read — marquer comme lue
    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    // POST /api/notifications/read-all — tout marquer comme lu
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->where('is_read', false)->update(['is_read' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues.']);
    }
}
