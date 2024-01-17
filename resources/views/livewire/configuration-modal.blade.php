<x-modal form-action="processModal">
    <x-slot name="title">
        @if($action == \App\Http\Livewire\ConfigurationModal::STORE_ACTION)
            Add configuration
        @else
            Edit version {{ $key }}
        @endif
    </x-slot>

    <x-slot name="content">
        <div class="flex justify-center">
            <div class="w-full text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <!-- KEY -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="key">Key</label>
                    <input
                        type="text"
                        id="key"
                        name="key"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="key">
                    @error('key')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- DESCRIPTION -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="description">Description</label>
                    <textarea
                        rows="4"
                        cols="50"
                        id="description"
                        name="description"
                        wire:model.debounce.200ms="description"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"></textarea>
                </div>
                <!--DATA TYPES -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="data_type">Data Type</label>
                    <select
                        id="data_type"
                        name="data_type"
                        wire:model="data_type"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                        <option {{ $action == \App\Http\Livewire\ConfigurationModal::STORE_ACTION ? 'selected' : '' }} value="0">Choose a data type</option>
                        @foreach ($data_types as $key => $value)
                            <option {{ $action == \App\Http\Livewire\ConfigurationModal::UPDATE_ACTION ? ($key == $data_type ? 'selected' : ''): '' }} value="{{ $key }}">{{ $value }}</option>
                        @endforeach
                    </select>
                    @error('data_type')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
            </div>
        </div>
    </x-slot>

    <x-slot name="buttons">
        <div class="flex w-full justify-center">
            <div class="pt-4 flex justify-between w-3/5">
                <button class="bg-red-500 text-white flex justify-center items-center w-4/12 px-4 py-3 rounded-md focus:outline-none">
                    Cancel
                </button>
                <button type="submit" class="bg-blue-500 flex justify-center items-center w-4/12 text-white px-4 py-3 rounded-md focus:outline-none">{{ ucfirst(strtolower($action)) }}</button>
            </div>
        </div>
    </x-slot>
</x-modal>
