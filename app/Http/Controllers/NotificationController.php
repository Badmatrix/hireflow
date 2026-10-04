<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $user = auth()->guard()->user();

        $notifications = $user
            ->notifications()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('notifications/pages/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(
        DatabaseNotification $notification
    ): RedirectResponse {
        $user = auth()->guard()->user();

        abort_unless(
            $notification->notifiable_id === $user->id &&
            $notification->notifiable_type === get_class($user),
            403
        );

        $notification->markAsRead();

        return $this->redirectFromNotification($notification);
    }

    public function markAllAsRead(): RedirectResponse
    {
        auth()->guard()->user()
            ->unreadNotifications
            ->markAsRead();

        return back();
    }

    private function redirectFromNotification(
        DatabaseNotification $notification
    ): RedirectResponse {
        $data = $notification->data;
    
        if (! empty($data['application_id'])) {
            return redirect()->route(
                'applications.show',
                $data['application_id']
            );
        }
    
        return redirect()->route('notifications.index');
    }
}
