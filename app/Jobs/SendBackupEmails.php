<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\BackupEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendBackupEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ( User::where('is_backup', true)->get() as $user) {
            $user->notify((new BackupEmail())->delay(now()->addMinute()));
            Log::debug('Backup notification sent', array('uuid' => $user->id, 'email' => $user->email));
            //$user->is_backup = false;
            //$user->save();
        }
    }
}
