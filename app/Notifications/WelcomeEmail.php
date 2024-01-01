<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmail extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('Thanks for registering and welcome to $4YT!')
            ->line('Your ANONYMOUS STUDENT ID# for the game is ' . $notifiable->getKey())
            ->line('AND you get 3 Dubl-U-nes to start !')
            ->line('Though you can’t play the game until the beginning of February (ofc we’ll remind you!) there’s still lots you can do when you Login….like:')
            ->line('1. Fill out your Instagram and/or LinkedIn handle(s) so we can give U more Dubl-U-nes!')
            ->line('2. Keep track of your Dubl-U-nes')
            ->line('3. Refer your friends (to earn more Dubl-U-nes)')
            ->line('4. Update your profile information')
            ->line('Also feel free to join our Discord where you can ask questions, offer commentary, and receive event updates, as well as exclusive ways to Learn more about and Earn More Dubl-U-nes');
    }
}
