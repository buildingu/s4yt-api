<?php

namespace App\Http\Livewire;

use App\Models\RaffleItem;
use App\Models\Version;
use LivewireUI\Modal\ModalComponent;

class RaffleVersionModal extends ModalComponent
{
    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";
    public $stock = null;
    public $active = false;
    public $raffle_item_id = null;
    public $name = null;

    public function render()
    {
        return view('livewire.raffle-version-modal');
    }

    public static function modalMaxWidth(): string
    {
        return 'sm';
    }

    public function mount($action, $raffle_partner_id, $raffle_item_id)
    {
        $this->action = $action;

        $raffle_item = RaffleItem::find($raffle_item_id);
        if(!$raffle_item) {
            return redirect()->route('raffle.area', ['id' => $raffle_partner_id]);
        }
        $this->raffle_item_id = $raffle_item->id;

        if($this->action == self::UPDATE_ACTION) {
            $pivot = $raffle_item->versions()->withPivot(['stock', 'active'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot;
            $this->stock = $pivot->stock;
            $this->active = $pivot->active;
            $this->name = $raffle_item->name;
        }
        return null;
    }

    protected function rules() : array
    {
        return [
            'stock' => 'required|integer|min:1',
            'active' => 'required|boolean'
        ];
    }

    public function processModal()
    {
        $validate = $this->validate();

        // toggle event
        $event = $this->action == self::STORE_ACTION ? 'addRaffleItemVersionEvent' : 'updateRaffleItemVersionEvent';

        $data = [
            'stock' => intval($this->stock),
            'active' => $this->active,
            'raffle_item_id' => $this->raffle_item_id
        ];

        $this->closeModalWithEvents([
            RaffleAreaModule::class => [ $event, [
                $data
            ]]
        ]);

    }
}
