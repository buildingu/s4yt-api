<?php

namespace App\Services;

use App\Models\EventPartner;
use App\Models\RaffleItem;
use App\Models\RafflePartner;
use App\Models\User;
use App\Models\Version;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RafflePartnerService
{
    public static function addRafflePartner(array $data, bool $admin = false)  : array
    {
        // user create
        $user = UserService::addUser($data, $admin);
        $user->assignRole(User::RAFFLE_PARTNER_ROLE);

        // event partner create
        $raffle_partner = RafflePartner::create([
            'organization_name' => $data['organization_name'],
            'description' => $data['description'],
            'resource_link' => $data['resource_link'],
            'active' => $data['active']
        ]);
        $raffle_partner->user()->save($user);
        Log::debug('addRafflePartner', array('event_partner' => json_encode($raffle_partner), 'user' => json_encode($user)));

        // media process
        $media_files = ['logo_default'];
        $media_process = MediaService::processMedia($raffle_partner, $media_files, $data);

        // send notification
        $user->notify((new VerifyEmail())->delay(now()->addMinute()));

        return [
            'raffle_partner' => $raffle_partner,
            'logo_default' => $media_process['logo_default'],
        ];
    }

    /**
     * Method updates raffle partner records. Only considers admin panel calls.
     * @param array $data
     * @return array|null
     */
    public static function updateRafflePartner(array $data) : ?array
    {
        $raffle_partner = RafflePartner::find($data['id']);
        if(!$raffle_partner) {
            return null;
        }

        UserService::updateUser($data, $raffle_partner->user, $data['email_update']);
        $raffle_partner->organization_name = $data['organization_name'];
        $raffle_partner->description = $data['description'];
        $raffle_partner->resource_link = $data['resource_link'];
        $raffle_partner->active = $data['active'];
        $raffle_partner->save();

        Log::debug('updateRafflePartner', array('event_partner' => json_encode($raffle_partner), 'user' => json_encode($raffle_partner->user)));

        // media process
        $media_files = ['logo_default'];
        $media_process = MediaService::processMedia($raffle_partner, $media_files, $data, true);

        // send notification
        if($data['email_update']) {
            $raffle_partner->user->notify((new VerifyEmail())->delay(now()->addMinute()));
            Log::info('Raffle partner {$raffle_partner->organization_name} verify email sent successfully.', ['id' => $raffle_partner->user->id, 'email' => $raffle_partner->user->email]);
        }

        return [
            'raffle_partner' => $raffle_partner,
            'logo_default' => $media_process['logo_default'],
        ];
    }

    /**
     * Method add a raffle item and relates it to the given raffle partner.
     * @param array $data
     * @return array|null
     */
    public static function addRaffleItem(array $data) : ?array
    {
        $raffle_partner = RafflePartner::find($data['raffle_partner_id']);

        if(!$raffle_partner) {
            return null;
        }

        // add raffle item
        $raffle_item = $raffle_partner->raffleItems()->create([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);

        Log::debug('addRaffleItem', array('raffle_item' => json_encode($raffle_item->id), 'added_by' => Auth::id()));

        // media process
        $media_files = ['main'];
        $media_process = MediaService::processMedia($raffle_item, $media_files, $data);

        return [
            'raffle_item' => $raffle_item,
            'main' => $media_process['main'],
        ];
    }


    /**
     * Method add a raffle item and relates it to the given raffle partner.
     * @param array $data
     * @return array|null
     */
    public static function updateRaffleItem(array $data) : ?array
    {
        $raffle_item = RaffleItem::find($data['raffle_item_id']);
        $prev_status = $raffle_item->active;

        if(!$raffle_item) {
            return null;
        }

        // add raffle item
        $raffle_item->name = $data['name'];
        $raffle_item->description = $data['description'];
        $raffle_item->active = $data['active'];
        $raffle_item->save();

        // disable raffle item version
        if($prev_status && !$data['active']) {
            $raffle_item->versions()->detach([Version::currentVersionId()]);
        }

        Log::debug('updateRaffleItem', array('raffle_item' => json_encode($raffle_item->id), 'updated_by' => Auth::id()));

        // media process
        $media_files = ['main'];
        $media_process = MediaService::processMedia($raffle_item, $media_files, $data, true);

        return [
            'raffle_item' => $raffle_item,
            'main' => $media_process['main'],
        ];
    }

    /**
     * Method relates the given raffle item to the current version.
     * @param array $data
     * @return bool|null
     */
    public static function addRaffleItemToCurrentVersion(array $data) : ?bool
    {
        // validate raffle item
        $raffle_item = RaffleItem::find($data['raffle_item_id']);
        if(!$raffle_item) {
            return null;
        }

        // validate active version
        $current_version_id = Version::currentVersionId();
        if(!isset($current_version_id) || !$raffle_item->active) {
            return false;
        }

        // add relation
        $raffle_item->versions()->attach($current_version_id, ['stock' => $data['stock'], 'active' => $data['active']]);
        Log::debug('addRaffleItemToCurrentVersion', array('raffle_item' => json_encode($raffle_item->versions()->withPivot(['stock', 'active'])->wherePivot('version_id',Version::currentVersionId())->first()), 'updated_by' => Auth::id()));
        return true;
    }

    public static function updateRaffleItemInCurrentVersion(array $data) : ?bool
    {
        // validate raffle item
        $raffle_item = RaffleItem::find($data['raffle_item_id']);
        if(!$raffle_item) {
            return null;
        }

        // validate active version
        $current_version_id = Version::currentVersionId();
        if(!isset($current_version_id) || !$raffle_item->active) {
            return false;
        }

        // add relation
        $raffle_item->versions()->sync([$current_version_id => ['stock' => $data['stock'], 'active' => $data['active']]]);
        Log::debug('updateRaffleItemInCurrentVersion', array('raffle_item' => json_encode($raffle_item->versions()->withPivot(['stock', 'active'])->wherePivot('version_id',Version::currentVersionId())->first()), 'updated_by' => Auth::id()));
        return true;
    }

}
