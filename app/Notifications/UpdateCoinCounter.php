<?php

namespace App\Notifications;

use App\Services\PlayerService;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class UpdateCoinCounter extends Notification implements ShouldBroadcast
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast'];
    }

    public function toBroadcast($notifiable) : BroadcastMessage
    {
        return new BroadcastMessage([
            'coins' => PlayerService::getCurrentPlayerCoins($notifiable, true),
            'referrer_id' => $notifiable->id
        ]);
    }
}
