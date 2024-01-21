<?php

namespace App\Http\Livewire;

use App\Models\Configuration;
use App\Models\ConfigurationDataType;
use App\Models\Version;
use Illuminate\Http\RedirectResponse;
use LivewireUI\Modal\ModalComponent;

class ConfigurationVersionModal extends ModalComponent
{
    public $version = null;
    public $configurations;
    public $configuration_version_values = [];

    public function render()
    {
        return view('livewire.configuration-version-modal');
    }

    public function mount($version_id) : ?RedirectResponse
    {
        $version = Version::find($version_id);
        if(!$version || !$version->active) {
            return redirect()->to('/versions');
        }
        $this->version = $version;
        $this->configurations = Configuration::with('configurationDataType')->get();
        foreach ($this->configurations as $configuration) {
            $this->configuration_version_values[$configuration->key] = [
                'value' => \App\Services\ConfigurationService::getValueByKeyAndVersionId($configuration->key, $this->version->id),
                'data_type' => $configuration->configurationDataType->data_type
            ];
        }
        return null;
    }

    protected function rules()
    {
        $rules = [];
        foreach ($this->configurations as $configuration) {
            $rules['configuration_version_values.' . $configuration->key . '.value'] = 'nullable|' . $configuration->configurationDataType->data_type ;
            if($configuration->configurationDataType->data_type == ConfigurationDataType::INTEGER) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|min:1';
            }
            if($configuration->configurationDataType->data_type == ConfigurationDataType::DATE) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|date_format:Y-m-d H:i';
            }

            if($configuration->key == Configuration::REGISTER_START) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|before:' . Configuration::GAME_START;
            }

            if($configuration->key == Configuration::GAME_START) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|after:' . Configuration::REGISTER_START . '|before:' . Configuration::REVIEW_START;
            }

            if($configuration->key == Configuration::REVIEW_START) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|after:' . Configuration::GAME_START . '|before:' . Configuration::REVIEW_END;
            }

            if($configuration->key == Configuration::REVIEW_END) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|after:' . Configuration::REVIEW_START . '|before:' . Configuration::GAME_END;
            }

            if($configuration->key == Configuration::GAME_END) {
                $rules['configuration_version_values.' . $configuration->key . '.value'] .= '|after:' . Configuration::REVIEW_END;
            }
        }
        return $rules;
    }

    protected $messages = [
        'configuration_version_values.*.value.integer' => 'The :attribute only accepts integers.',
        'configuration_version_values.*.value.min' => 'The :attribute minimum value is 1.',
        'configuration_version_values.*.value.date_format' => 'The :attribute only accepts dates in format Y-m-d H:i.',
        'configuration_version_values.register_start.value.before' => 'The register_start should be before the game_start',
        'configuration_version_values.game_start.value.before' => 'The game_start should be before the review_start',
        'configuration_version_values.game_start.value.after' => 'The game_start should be after the register_start',
        'configuration_version_values.review_start.value.before' => 'The review_start should be before the review_end',
        'configuration_version_values.review_start.value.after' => 'The review_start should be after the game_start',
        'configuration_version_values.review_end.value.before' => 'The review_end should be before the game_end',
        'configuration_version_values.review_end.value.after' => 'The review_end should be after the review_start',
        'configuration_version_values.game_end.value.after' => 'The game_end should be after the review_end',
    ];

    protected $validationAttributes = [
        'configuration_version_values.register_coins.value' => 'register coins',
        'configuration_version_values.referral_coins.value' => 'referral coins',
        'configuration_version_values.instagram_coins.value' => 'instagram coins',
        'configuration_version_values.register_start.value' => 'register start',
        'configuration_version_values.game_start.value' => 'game start',
        'configuration_version_values.review_start.value' => 'review start',
        'configuration_version_values.review_end.value' => 'review end',
        'configuration_version_values.game_end.value' => 'game end',
    ];

    public function processModal()
    {
        $validated = $this->validate();
        $this->closeModalWithEvents([
            VersionModule::class => ['setConfigurationVersionValuesEvent', [
                $this->configuration_version_values
            ]]
        ]);
    }
}
