<?php

namespace App\Services;

use App\Models\EventPartner;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EventPartnerService
{
    public static function addEventPartner(array $data, bool $admin = false)  : EventPartner
    {
        // user create
        $user = UserService::addUser($data, $admin);

        // event partner create
        $event_partner = EventPartner::create([
            'organization_name' => $data['organization_name'],
            'slug' => Str::slug($data['organization_name'], '-'),
            'description' => $data['description'],
            'meet_day' => $data['meet_day'],
            'meet_from' => $data['meet_from'],
            'meet_to' => $data['meet_to'],
            'meet_link' => $data['meet_link'],
            'youtube_link' => $data['youtube_link'],
        ]);
        $event_partner->user()->save($user);
        Log::debug('addEventPartner', array('event_partner' => json_encode($event_partner), 'user' => json_encode($user)));

        // process logo default
        if(isset($data['logo_default']['path']) && strlen($data['logo_default']['filename']) > 0) {
            $event_partner
                ->addMediaFromDisk('livewire-tmp/'. $data['logo_default']['path'])
                ->usingFileName($data['logo_default']['filename'])
                ->toMediaCollection('logo_default');
        }

        // process logo s4yt
        if(isset($data['logo_s4yt']['path']) && strlen($data['logo_s4yt']['filename']) > 0) {
            $event_partner
                ->addMediaFromDisk('livewire-tmp/'. $data['logo_s4yt']['path'])
                ->usingFileName($data['logo_s4yt']['filename'])
                ->toMediaCollection('logo_s4yt');
        }

        // send notification
        $user->notify((new VerifyEmail())->delay(now()->addMinute()));

        return $event_partner;
    }

    public static function updateEventPartner(array $data, EventPartner $eventPartner)
    {
        $user = UserService::updateUser($data, $eventPartner->user, $data['email_update']);

    }
}
