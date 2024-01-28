<?php

namespace App\Http\Livewire;

use App\Models\EventPartner;
use App\Models\RafflePartner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Livewire\WithFileUploads;
use LivewireUI\Modal\ModalComponent;

class RafflePartnerModal extends ModalComponent
{
    use WithFileUploads;

    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";
    public $name = "";
    public $email = "";
    public $current_email = "";
    public $organization_name = "";
    public $logo_default = null;
    public $description = null;
    public $raffle_partner_id;
    public $raffle_partner = null;

    public function render()
    {
        return view('livewire.raffle-partner-modal');
    }

    public function mount($action, $raffle_partner_id = null) : ?RedirectResponse
    {
        $this->action = $action;
        if($this->action == self::UPDATE_ACTION) {
            $raffle_partner = RafflePartner::find($raffle_partner_id);
            if(!$raffle_partner) {
                return redirect()->to('/raffle-partners');
            }
            $this->name = $raffle_partner->user->name;
            $this->email = $raffle_partner->user->email;
            $this->current_email = $raffle_partner->user->email;
            $this->organization_name = $raffle_partner->organization_name;
            $this->description = $raffle_partner->description;
            $this->logo_default = null;
            $this->raffle_partner_id = $raffle_partner->id;
            $this->raffle_partner = $raffle_partner;
        }
        return null;
    }

    protected function rules() : array
    {
        return [
            'name' => 'required|string|min:2',
            'email' =>  $this->action == self::STORE_ACTION ? 'required|string|email:rfc,dns|unique:users,email' : 'required|string|email:rfc,dns',
            'organization_name' =>  $this->action == self::STORE_ACTION ? 'required|string|min:3|unique:raffle_partners,organization_name' : 'required|string|min:3',
            'description' => 'nullable|string',
            'logo_default' => 'nullable|max:4096|mimes:png,jpeg',
        ];
    }

    protected $validationAttributes = [
        'name' => 'user name',
        'organization_name' => 'organization name',
        'logo_default' => 'logo',
    ];

    public function processModal()
    {
        $this->validate();

        // toggle event
        $event = $this->action == self::STORE_ACTION ? 'addRafflePartnerEvent' : 'updateRafflePartnerEvent';

        // default logo
        $logo_default_filename = null;
        if($this->logo_default) {
            $filename = explode(".",$this->logo_default->getClientOriginalName());
            $extension = end($filename);
            $logo_default_filename = 'logo_' . Str::slug($this->organization_name, '_') . '_default.' . $extension;
        }

        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'organization_name' => $this->organization_name,
            'description' => $this->description,
            'logo_default' => [
                'path' => $this->logo_default ? $this->logo_default->getFilename() : null,
                'filename' => $logo_default_filename,
            ],
            'id' => $this->raffle_partner_id,
            'email_update' => $this->current_email != $this->email
        ];

        $this->closeModalWithEvents([
            RafflePartnerModule::class => [ $event, [
                $data
            ]]
        ]);
    }
}
