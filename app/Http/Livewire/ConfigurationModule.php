<?php

namespace App\Http\Livewire;

use App\Models\Configuration;
use App\Services\ConfigurationService;
use Livewire\Component;

class ConfigurationModule extends Component
{
    public $message = "";
    public $message_type = "";

    public function render()
    {
        $configurations = Configuration::with('configurationDataType')->get();
        return view('livewire.configuration-module', ['configurations' => $configurations]);
    }
    public $listeners = [
        'addConfigurationEvent' => 'addConfiguration',
        'updateConfigurationEvent' => 'updateConfiguration'
    ];

    public function addConfiguration($key, $description, $data_type) : void
    {
        $configuration = ConfigurationService::addConfiguration($key, $description, $data_type);
        if(!isset($configuration)) {
            $this->message = "An error has occurred. The request has not been completed.";
            $this->message_type = "error";
        } else {
            $this->message = "Configuration has been created successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }

    public function updateConfiguration($key, $description, $data_type, $configuration_id) : void
    {
        $configuration = ConfigurationService::updateConfiguration($key, $description, $data_type, $configuration_id);
        if(!isset($configuration)) {
            $this->message = "An error has occurred. The request has not been completed.";
            $this->message_type = "error";
        } else {
            $this->message = "Configuration has been updated successfully";
            $this->message_type = "success";
        }
        $this->emit('showMessage');
    }
}
