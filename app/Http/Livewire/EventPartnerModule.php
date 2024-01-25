<?php

namespace App\Http\Livewire;

use App\Models\EventPartner;
use App\Services\EventPartnerService;
use Livewire\Component;

class EventPartnerModule extends Component
{
    public $message = "";
    public $message_type = "";

    public function render()
    {
        $event_partners = EventPartner::with('user')->get();
        return view('livewire.event-partner-module', ['event_partners' => $event_partners]);
    }

    public $listeners = [
        'addEventPartnerEvent' => 'addEventPartner',
        'updateEventPartnerEvent' => 'updateEventPartner'
    ];

    public function addEventPartner(array $data) : void
    {
        $event_partner = EventPartnerService::addEventPartner($data, true);
        if( (isset($event_partner['logo_default']) && !$event_partner['logo_default']) ||
            (isset($event_partner['logo_s4yt']) && !$event_partner['logo_s4yt'])) {
            $this->message = "Event Partner has been created with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Event Partner has been created successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');

    }

    public function updateEventPartner(array $data): void
    {
        $event_partner = EventPartnerService::updateEventPartner($data);
        if( (isset($event_partner['logo_default']) && !$event_partner['logo_default']) ||
            (isset($event_partner['logo_s4yt']) && !$event_partner['logo_s4yt'])) {
            $this->message = "Event Partner has been updated with media problems. Please check.";
            $this->message_type = "info";
        } else {
            $this->message = "Event Partner has been updated successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }
}
