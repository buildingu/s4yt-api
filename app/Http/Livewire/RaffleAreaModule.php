<?php

namespace App\Http\Livewire;

use App\Models\RaffleItem;
use App\Models\RafflePartner;
use App\Models\User;
use App\Models\Version;
use App\Services\RafflePartnerService;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class RaffleAreaModule extends Component
{
    public $message = "";
    public $message_type = "";
    public $raffle_partner_id = null;

    public function render()
    {
        $raffle_items = RaffleItem::withCount(
            ['versions as in_version' => function ($q){
                $q->where('version_id',Version::currentVersionId());
            }]
        )->where('raffle_partner_id', $this->raffle_partner_id)->get();
        return view('livewire.raffle-area-module', [ 'raffle_items' => $raffle_items]);
    }
    public $listeners = [
        'addRaffleItemEvent' => 'addRaffleItem',
        'updateRaffleItemEvent' => 'updateRaffleItem',
        'addRaffleItemVersionEvent' => 'addRaffleItemVersion',
        'updateRaffleItemVersionEvent' => 'updateRaffleItemVersion',
    ];

    public function mount($id)
    {
        // the raffle partner can only see his related data
        if(Auth::user()->hasRole(User::RAFFLE_PARTNER_ROLE) && Auth::user()->userable->id != $id){
            return redirect()->route('raffle.area', ['id' => \Illuminate\Support\Facades\Auth::user()->userable->id]);
        }
        $this->raffle_partner_id = $id;
        return null;
    }

    public function addRaffleItem(array $data) : void
    {
        $raffle_item = RafflePartnerService::addRaffleItem($data);
        if(isset($raffle_item['main']) && !$raffle_item['main']) {
            $this->message = "Raffle item has been created with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Raffle item has been created successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function updateRaffleItem(array $data) : void
    {
        $raffle_item = RafflePartnerService::updateRaffleItem($data);
        if( isset($raffle_item['main']) && !$raffle_item['main'] ) {
            $this->message = "Raffle item has been updated with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Raffle item has been updated successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function addRaffleItemVersion(array $data) : void
    {
        $response = RafflePartnerService::addRaffleItemToCurrentVersion($data);
        if( !isset($response) ) {
            $this->message = "Raffle item not found.";
            $this->message_type = "error";
        } else if(!$response) {
            $this->message = "There were some problems. Please check status of current version.";
            $this->message_type = "error";
        } else {
            $this->message = "Raffle item has been added to the current version successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function updateRaffleItemVersion(array $data) : void
    {
        $response = RafflePartnerService::updateRaffleItemInCurrentVersion($data);
        if( !isset($response) ) {
            $this->message = "Raffle item not found.";
            $this->message_type = "error";
        } else if(!$response) {
            $this->message = "There were some problems. Please check status of current version.";
            $this->message_type = "error";
        } else {
            $this->message = "Raffle item has been updated in the current version successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }
}
