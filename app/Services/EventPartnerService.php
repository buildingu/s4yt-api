<?php

namespace App\Services;

use App\Models\EventPartner;
use App\Models\User;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class EventPartnerService
{
    public static function addEventPartner(array $data, bool $admin = false)  : array
    {
        // user create
        $user = UserService::addUser($data, $admin);
        $user->assignRole(User::EVENT_PARTNER_ROLE);

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

        // media process
        $media_files = ['logo_default', 'logo_s4yt'];
        $media_process = MediaService::processMedia($event_partner, $media_files, $data);

        // send notification
        $user->notify((new VerifyEmail())->delay(now()->addMinute()));

        return [
            'event_partner' => $event_partner,
            'logo_default' => $media_process['logo_default'],
            'logo_s4yt' => $media_process['logo_s4yt'],
        ];
    }

    /**
     * Method updates event partner records. Only considers admin panel calls.
     * @param array $data
     * @return EventPartner|null
     */
    public static function updateEventPartner(array $data) : ?array
    {
        $event_partner = EventPartner::find($data['id']);
        if(!$event_partner) {
            return null;
        }

        UserService::updateUser($data, $event_partner->user, $data['email_update']);
        $event_partner->organization_name = $data['organization_name'];
        $event_partner->slug = Str::slug($data['organization_name'], '-');
        $event_partner->description = $data['description'];
        $event_partner->meet_day = $data['meet_day'];
        $event_partner->meet_from = $data['meet_from'];
        $event_partner->meet_to = $data['meet_to'];
        $event_partner->meet_link = $data['meet_link'];
        $event_partner->youtube_link = $data['youtube_link'];
        $event_partner->save();

        Log::debug('updateEventPartner', array('event_partner' => json_encode($event_partner), 'user' => json_encode($event_partner->user)));

        // media process
        $media_files = ['logo_default', 'logo_s4yt'];
        $media_process = MediaService::processMedia($event_partner, $media_files, $data, true);

        // send notification
        if($data['email_update']) {
            $event_partner->user->notify((new VerifyEmail())->delay(now()->addMinute()));
            Log::info('Raffle partner {$event_partner->organization_name} verify email sent successfully.', ['id' => $event_partner->user->id, 'email' => $event_partner->user->email]);
        }

        return [
            'event_partner' => $event_partner,
            'logo_default' => $media_process['logo_default'],
            'logo_s4yt' => $media_process['logo_s4yt'],
        ];
    }


}
