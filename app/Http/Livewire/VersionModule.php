<?php

namespace App\Http\Livewire;

use App\Models\Version;
use Livewire\Component;

class VersionModule extends Component
{
    public $message = "";
    public $message_type = "";

    public function render()
    {
        $versions = Version::select('id', 'year', 'active')->get();
        return view('livewire.version-module', ['versions' => $versions]);
    }
}
