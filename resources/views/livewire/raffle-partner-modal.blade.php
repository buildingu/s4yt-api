<x-modal form-action="processModal">
    <x-slot name="title">
        @if($action == \App\Http\Livewire\RafflePartnerModal::STORE_ACTION)
            Add raffle partner
        @else
            Edit {{ $organization_name }}
        @endif
    </x-slot>

    <x-slot name="content">
        <div class="flex justify-center">
            <div class="w-full text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <!-- NAME -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="name">User name <span class="align-super text-red-500">*</span></label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="name">
                    @error('name')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- EMAIL -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="email">User email <span class="align-super text-red-500">*</span></label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="email">
                    @error('email')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- ORGANIZATION NAME -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="organization_name">Organization name <span class="align-super text-red-500">*</span></label>
                    <input
                        type="text"
                        id="organization_name"
                        name="organization_name"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="organization_name">
                    @error('organization_name')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- RESOURCE LINK -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="resource_link">Resource link </label>
                    <input
                        type="text"
                        id="resource_link"
                        name="resource_link"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="resource_link">
                    @error('resource_link')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- DESCRIPTION -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="description">Description</label>
                    <textarea
                        rows="7"
                        cols="50"
                        name="description"
                        id="description"
                        wire:model.debounce.200ms="description"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"></textarea>
                </div>
                <!-- LOGO DEFAULT -->
                <div class="flex items-center">
                    <div class="flex flex-col">
                        <label class="leading-loose" for="logo_default">Main Logo</label>
                        <input
                            type="file"
                            id="logo_default"
                            name="logo_default"
                            wire:model.debounce.500ms="logo_default"
                            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                        <div wire:loading wire:target="logo_default">Uploading...</div>
                        @error('logo_default')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                    </div>
                    @if($action == \App\Http\Livewire\RafflePartnerModal::STORE_ACTION && isset($logo_default))
                        <img alt="logo_default" src="{{ $logo_default->temporaryUrl() }}" class="w-16 mt-8 ml-8"/>
                    @elseif($action == \App\Http\Livewire\RafflePartnerModal::UPDATE_ACTION  && $raffle_partner->getFirstMediaUrl('logo_default'))
                        <img alt="logo_default" src="{{  $raffle_partner->getFirstMediaUrl('logo_default') }}" class="w-16 mt-4 ml-8"/>
                    @endif
                </div>
                <!-- ACTIVE -->
                <div class="flex items-center mt-4">
                    <div class="flex items-center">
                        <input
                            id="active"
                            aria-describedby="active"
                            type="checkbox"
                            class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-5 w-5 rounded"
                            value="{{ $active == true }}"
                            checked="{{ $active ? 'true':'false' }}"
                            wire:model="active">
                    </div>
                    <div class="ml-3">
                        <label for="active" class="text-gray-900">Active?</label>
                    </div>
                </div>
            </div>
        </div>
    </x-slot>

    <x-slot name="buttons">
        <div class="flex w-full justify-center">
            <div class="pt-4 flex justify-between w-3/5">
                <button class="bg-red-500 text-white flex justify-center items-center w-3/12 px-4 py-3 rounded-md focus:outline-none">
                    Cancel
                </button>
                <button type="submit" class="bg-blue-500 flex justify-center items-center w-3/12 text-white px-4 py-3 rounded-md focus:outline-none">{{ ucfirst(strtolower($action)) }}</button>
            </div>
        </div>
    </x-slot>
</x-modal>
