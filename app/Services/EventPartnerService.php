<?php

namespace App\Services;

use App\Models\EventPartner;
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
        $media_process = self::processMedia($event_partner, $data);

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
        $media_process = self::processMedia($event_partner, $data, true);

        // send notification
        if($data['email_update']) {
            $event_partner->user->notify((new VerifyEmail())->delay(now()->addMinute()));
        }

        return [
            'event_partner' => $event_partner,
            'logo_default' => $media_process['logo_default'],
            'logo_s4yt' => $media_process['logo_s4yt'],
        ];
    }

    /**
     * Methods add or updates media collections for this object
     * @param EventPartner $event_partner
     * @param array $data
     * @param bool $is_update
     * @return array
     */
    private static function processMedia(EventPartner $event_partner, array $data, bool $is_update = false) : array
    {
        // process logo default
        $logo_default = null;
        if(isset($data['logo_default']['path']) && strlen($data['logo_default']['filename']) > 0) {
            $logo_default = self::addMedia($event_partner, $data['logo_default']['path'], $data['logo_default']['filename'], 'logo_default', $is_update );
        }

        // process logo s4yt
        $logo_s4yt = null;
        if(isset($data['logo_s4yt']['path']) && strlen($data['logo_s4yt']['filename']) > 0) {
            $logo_s4yt = self::addMedia($event_partner, $data['logo_s4yt']['path'], $data['logo_s4yt']['filename'], 'logo_s4yt', $is_update );
        }

        return [
            'logo_default' => $logo_default,
            'logo_s4yt' => $logo_s4yt,
        ];
    }

    /**
     * Method add media relationship to the object referred. Only to use in single media file collection.
     * @param EventPartner $event_partner
     * @param string $path
     * @param string $filename
     * @param string $collection
     * @param bool $is_update
     * @return bool
     */
    private static function addMedia(EventPartner $event_partner, string $path, string $filename, string $collection, bool $is_update = false) : bool
    {
        $flag = true;
        if($is_update) {
            $event_partner->clearMediaCollection($collection);
        }

        try {
            $event_partner
                ->addMediaFromDisk('livewire-tmp/'. $path)
                ->usingFileName($filename)
                ->toMediaCollection($collection);
            Log::debug('addMediaEventPartner', array('event_partner' => $event_partner->id, 'collection' => $collection, 'update' => $is_update));
        }catch (FileDoesNotExist|FileIsTooBig $e) {
            $flag = false;
            Log::debug('addMediaEventPartner', array('exception' => $e->getMessage(), 'event_partner' => $event_partner->id, 'collection' => $collection, 'update' => $is_update));
        }
        return $flag;
    }
}
