<?php

namespace App\Http\Livewire;

use App\Models\Version;
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
    public $version_id;

    public function render()
    {
        return view('livewire.version-modal');
    }

    public function mount($action, $version_id = null) : ?RedirectResponse
    {
        $this->action = $action;
        if($this->action == self::UPDATE_ACTION) {
            $version = Version::find($version_id);
            if(!$version) {
                return redirect()->to('/versions');
            }
            $this->year = $version->year;
            $this->active = $version->active;
            $this->version_id = $version_id;
        }
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
                $this->version_id

            ]]
        ]);
    }
}
