<?php

namespace App\Http\Livewire;

use App\Models\Configuration;
use App\Models\ConfigurationDataType;
use Illuminate\Http\RedirectResponse;
use LivewireUI\Modal\ModalComponent;

class ConfigurationModal extends ModalComponent
{
    const STORE_ACTION = 'create';
    const UPDATE_ACTION = 'update';

    public $action = "";

    public $key = "";
    public $description = "";
    public $data_type = 0;
    public $data_types = [];
    public $configuration_id = 0;

    public function render()
    {
        $this->data_types = ConfigurationDataType::all()->pluck('data_type', 'id')->toArray();
        return view('livewire.configuration-modal');
    }

    public function mount($action, $configuration_id = null) : ?RedirectResponse
    {
        $this->action = $action;
        if($this->action == self::UPDATE_ACTION) {
            $configuration = Configuration::find($configuration_id);
            if(!$configuration) {
                return redirect()->to('/configurations');
            }
            $this->key = $configuration->key;
            $this->description = $configuration->description;
            $this->data_type = $configuration->configurationDataType->id;
            $this->configuration_id = $configuration->id;
        }
        return null;
    }

    protected function rules()
    {
        return [
            'key' => 'required|string' .
                $this->action == self::STORE_ACTION ? '|unique:configurations,key' : '',
            'description' => 'nullable|string',
            'data_type' => 'required|integer|min:1'
        ];
    }

    protected $messages = [
        'data_type.min' => 'The data type selected is not valid.',
    ];

    public function processModal()
    {
        $validated = $this->validate();
        $event = $this->action == self::STORE_ACTION ? 'addConfigurationEvent' : 'updateConfigurationEvent';
        $this->closeModalWithEvents([
            ConfigurationModule::class => [ $event, [
                $validated['key'],
                $validated['description'],
                $validated['data_type'],
                $this->configuration_id
            ]]
        ]);
    }
}
