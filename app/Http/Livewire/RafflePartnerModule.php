<?php

namespace App\Http\Livewire;

use App\Models\RafflePartner;
use App\Models\Version;
use App\Services\RafflePartnerService;
use Livewire\Component;

class RafflePartnerModule extends Component
{
    public $message = "";
    public $message_type = "";

    public function render()
    {
        $current_version_id = Version::currentVersionId();
        $raffle_partners = RafflePartner::whereHas('user.versions', function($q) use ($current_version_id){
            if(isset($current_version_id)) {
                $q->where('version_id', $current_version_id);
            }
        })->get();
        return view('livewire.raffle-partner-module', [ 'raffle_partners' => $raffle_partners ]);
    }

    public $listeners = [
        'addRafflePartnerEvent' => 'addRafflePartner',
        'updateRafflePartnerEvent' => 'updateRafflePartner'
    ];

    public function addRafflePartner(array $data) : void
    {
        $raffle_partner = RafflePartnerService::addRafflePartner($data, true);
        if(isset($raffle_partner['logo_default']) && !$raffle_partner['logo_default']) {
            $this->message = "Raffle partner has been created with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Raffle partner has been created successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function updateRafflePartner(array $data) : void
    {
        $raffle_partner = RafflePartnerService::updateRafflePartner($data);
        if( isset($raffle_partner['logo_default']) && !$raffle_partner['logo_default'] ) {
            $this->message = "Raffle Partner has been updated with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Raffle Partner has been updated successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }
}
