<?php

namespace App\Http\Livewire;

use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use LivewireUI\Modal\ModalComponent;

class VersionModal extends ModalComponent
{
    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";
    public $active = false;
    public $year = "";

    public function render()
    {
        return view('livewire.version-modal');
    }

    public function mount($action, $version_id = null) : ?RedirectResponse
    {
        $this->action = $action;
        return null;
    }

    protected function rules()
    {
        return [
            'year' => 'required|numeric|digits:4|min:' . Carbon::now()->year,
            'active' => 'required|boolean'
        ];
    }

    public function processModal()
    {

        $validated = $this->validate();
        $event = $this->action == self::STORE_ACTION ? 'addVersionEvent' : 'updateVersionEvent';
        $this->closeModalWithEvents([
            VersionModule::class => [ $event, [
                $validated['year'],
                $validated['active'],
            ]]
        ]);
    }
}
