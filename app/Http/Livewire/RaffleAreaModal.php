<?php

namespace App\Http\Livewire;

use App\Models\RaffleItem;
use App\Models\RafflePartner;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Livewire\WithFileUploads;
use LivewireUI\Modal\ModalComponent;

class RaffleAreaModal extends ModalComponent
{
    use WithFileUploads;

    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";
    public $name = "";
    public $description = null;
    public $main = null;
    public $active = true;
    public $raffle_partner = null;
    public $raffle_partner_id = null;
    public $raffle_item_id;
    public $raffle_item = null;

    public function render()
    {
        return view('livewire.raffle-area-modal');
    }

    public function mount($action, $raffle_partner_id, $raffle_item_id = null)
    {
        $this->action = $action;
        $this->raffle_partner_id = $raffle_partner_id;
        $this->raffle_partner = RafflePartner::find($raffle_partner_id);
        if($this->action == self::UPDATE_ACTION) {
            $raffle_item = RaffleItem::find($raffle_item_id);
            if(!$raffle_item) {
                return redirect()->route('raffle.area', ['id' => $raffle_partner_id]);
            }
            $this->raffle_item = $raffle_item;
            $this->name = $raffle_item->name;
            $this->description =$raffle_item->description;
            $this->main = null;
            $this->raffle_item_id = $raffle_item->id;
            $this->active = $raffle_item->active;
        }

        return null;
    }

    public static function modalMaxWidth(): string
    {
        return 'sm';
    }

    protected function rules() : array
    {
        return [
            'name' => 'required|string|min:2',
            'description' => 'required|string|min:1',
            'main' => $this->action == self::STORE_ACTION ? 'required|max:4096|mimes:png,jpeg' : 'nullable|max:4096|mimes:png,jpeg',
        ];
    }

    protected $validationAttributes = [
        'main' => 'image',
    ];

    public function processModal()
    {
        $this->validate();

        // toggle event
        $event = $this->action == self::STORE_ACTION ? 'addRaffleItemEvent' : 'updateRaffleItemEvent';

        // default logo
        $main_filename = null;
        if($this->main) {
            $filename = explode(".",$this->main->getClientOriginalName());
            $extension = end($filename);
            $main_filename = 'item_' . Str::slug($this->raffle_partner->organization_name, '_') . '_' . Str::slug($this->name, '_') . '.' . $extension;
        }

        $data = [
            'name' => $this->name,
            'description' => strlen($this->description) > 0 ? $this->description : null,
            'main' => [
                'path' => $this->main ? $this->main->getFilename() : null,
                'filename' => $main_filename,
            ],
            'raffle_partner_id' => $this->raffle_partner_id,
            'raffle_item_id' => $this->raffle_item_id,
            'active' => $this->active,
        ];

        $this->closeModalWithEvents([
            RaffleAreaModule::class => [ $event, [
                $data
            ]]
        ]);
    }
}
