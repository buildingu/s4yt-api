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
        $this->message = "Event Partner has been created successfully with ID " . $event_partner->id;
        $this->message_type = "success";
        $this->emit('showMessage');
    }

    public function updateEventPartner(array $data): void
    {
        dd($data);
        $event_partner = EventPartner::find($data['id']);

    }
}
