<?php

namespace App\Http\Livewire;

use App\Models\EventPartner;
use Illuminate\Support\Str;
use Livewire\WithFileUploads;
use LivewireUI\Modal\ModalComponent;
use Illuminate\Http\RedirectResponse;

class EventPartnerModal extends ModalComponent
{
    use WithFileUploads;

    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";
    public $name = "";
    public $email = "";
    public $current_email = "";
    public $organization_name = "";
    public $description = null;
    public $meet_day = null;
    public $meet_from = null;
    public $meet_to = null;
    public $meet_link = null;
    public $youtube_link = null;
    public $logo_default = null;
    public $logo_s4yt = null;
    public $event_partner_id;
    public $event_partner = null;

    public function render()
    {
        return view('livewire.event-partner-modal');
    }

    public static function modalMaxWidth(): string
    {
        return '6xl';
    }

    public function mount($action, $event_partner_id = null) : ?RedirectResponse
    {
        $this->action = $action;
        if($this->action == self::UPDATE_ACTION) {
            $event_partner = EventPartner::find($event_partner_id);
            if(!$event_partner) {
                return redirect()->to('/event-partners');
            }
            $this->name = $event_partner->user->name;
            $this->email = $event_partner->user->email;
            $this->current_email = $event_partner->user->email;
            $this->organization_name = $event_partner->organization_name;
            $this->description = $event_partner->description;
            $this->meet_day = $event_partner->meet_day;
            $this->meet_from = $event_partner->meet_from;
            $this->meet_to = $event_partner->meet_to;
            $this->meet_link = $event_partner->meet_link;
            $this->youtube_link = $event_partner->youtube_link;
            $this->logo_default = null;
            $this->logo_s4yt = null;
            $this->event_partner_id = $event_partner->id;
            $this->event_partner = $event_partner;
        }
        return null;
    }

    protected function rules() : array
    {
        return [
            'name' => 'required|string|min:2',
            'email' =>  $this->action == self::STORE_ACTION ? 'required|string|email:rfc,dns|unique:users,email' : 'required|string|email:rfc,dns',
            'organization_name' =>  $this->action == self::STORE_ACTION ? 'required|string|min:3|unique:event_partners,organization_name' : 'required|string|min:3',
            'description' => 'nullable|string',
            'meet_day' => 'nullable|date_format:Y-m-d',
            'meet_from' => 'nullable|date_format:H:i',
            'meet_to' => 'nullable|date_format:H:i|after:meet_from',
            'meet_link' => 'nullable|string|url',
            'youtube_link' => 'nullable|string|url',
            'logo_default' => 'nullable|max:4096|mimes:png,jpeg',
            'logo_s4yt' => 'nullable|max:4096|mimes:png,jpeg'
        ];
    }

    protected $validationAttributes = [
        'name' => 'user name',
        'organization_name' => 'organization name',
        'meet_day' => 'meeting day',
        'meet_from' => 'meeting start time',
        'meet_to' => 'meeting end time',
        'meet_link' => 'meet link',
        'youtube_link' => 'youtube link',
        'logo_default' => 'logo',
        'logo_s4yt' => 's4yt logo',
    ];

    public function processModal()
    {
        $this->validate();

        // toggle event
        $event = $this->action == self::STORE_ACTION ? 'addEventPartnerEvent' : 'updateEventPartnerEvent';

        // default logo
        $logo_default_filename = null;
        if($this->logo_default) {
            $filename = explode(".",$this->logo_default->getClientOriginalName());
            $extension = end($filename);
            $logo_default_filename = 'logo_' . Str::slug($this->organization_name, '_') . '_default.' . $extension;
        }

        // s4yt logo
        $logo_s4yt_filename = null;
        if($this->logo_s4yt) {
            $filename = explode(".",$this->logo_s4yt->getClientOriginalName());
            $extension = end($filename);
            $logo_s4yt_filename = 'logo_' . Str::slug($this->organization_name, '_') . '_s4yt.' . $extension;
        }

        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'organization_name' => $this->organization_name,
            'description' =>strlen($this->description) > 0 ? $this->description : null,
            'meet_day' => strlen($this->meet_day) > 0 ? $this->meet_day : null,
            'meet_from' => strlen($this->meet_from) > 0 ? $this->meet_from : null,
            'meet_to' => strlen($this->meet_to) > 0 ? $this->meet_to : null,
            'meet_link' => strlen($this->meet_link) > 0 ? $this->meet_link : null,
            'youtube_link' => strlen($this->youtube_link) > 0 ? $this->youtube_link : null,
            'logo_default' => [
                'path' => $this->logo_default ? $this->logo_default->getFilename() : null,
                'filename' => $logo_default_filename,
            ],
            'logo_s4yt' => [
                'path' => $this->logo_s4yt ? $this->logo_s4yt->getFilename() : null,
                'filename' => $logo_s4yt_filename,
            ],
            'id' => $this->event_partner_id,
            'email_update' => $this->current_email != $this->email
        ];

        $this->closeModalWithEvents([
            EventPartnerModule::class => [ $event, [
                $data
            ]]
        ]);
    }
}
