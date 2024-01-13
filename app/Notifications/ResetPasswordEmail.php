<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class ResetPasswordEmail extends Notification
{
    use Queueable;

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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $resetPasswordUrl = $this->resetPasswordUrl($notifiable);

        return (new MailMessage)
            ->subject('Forgotten Password')
            ->line('Please click the button below to reset your password.')
            ->action('Reset password', $resetPasswordUrl )
            ->line('This link will work for ' . env('MAIL_EXPIRE', 10) . ' minutes. If you did not create an account, no further action is required.');
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function resetPasswordUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'player.reset',
            Carbon::now()->addMinutes(intval(config('auth.verification.expire', 10))),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
