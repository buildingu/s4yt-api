<?php

namespace App\Http\Livewire;

use App\Models\Version;
use App\Services\VersionService;
use Livewire\Component;

class VersionModule extends Component
{
    public $message = "";
    public $message_type = "";

    public function render()
    {
        $versions = Version::select('id', 'year', 'active')->orderBy('year', 'DESC')->get();
        return view('livewire.version-module', ['versions' => $versions]);
    }

    public $listeners = [
        'addVersionEvent' => 'addVersion',
        'updateVersionEvent' => 'updateVersion'
    ];

    public function addVersion($year, $active) : void
    {
        $version = VersionService::addVersion($year, $active);
        if(!isset($version)) {
            $this->message = "An error has occurred. The request has not been completed.";
            $this->message_type = "error";
        } else {
            $this->message = "Version has been created successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function updateVersion($year, $active, $version_id) : void
    {
        $version = VersionService::updateVersion($year, $active, $version_id);
        if(!isset($version)) {
            $this->message = "An error has occurred. The request has not been completed.";
            $this->message_type = "error";
        } else {
            $this->message = "Version has been updated successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }
}
