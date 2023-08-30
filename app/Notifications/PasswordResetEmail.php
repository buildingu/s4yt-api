<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetEmail extends Notification
{
    public $token;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(String $token)
    {
        $this -> token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $resetUrl = config('app.front_url').'/password-reset?token='.$this->token.'&email='.$notifiable->email;

        return (new MailMessage)
            ->subject('Password reset')
            ->line('Please click the button below to reset your password.')
            ->action('Reset', $resetUrl );
    }
}
