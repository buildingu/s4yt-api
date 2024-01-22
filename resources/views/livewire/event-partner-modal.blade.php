<x-modal form-action="processModal">
    <x-slot name="title">
        @if($action == \App\Http\Livewire\EventPartnerModal::STORE_ACTION)
            Add event partner
        @else
            Edit {{ $organization_name }}
        @endif
    </x-slot>

    <x-slot name="content">
        <div class="flex justify-evenly">
            <!-- COLUMN LEFT -->
            <div class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 w-2/5">
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
                <!-- YOUTUBE LINK -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="youtube_link">Youtube link</label>
                    <input
                        type="text"
                        id="youtube_link"
                        name="youtube_link"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="youtube_link">
                    @error('youtube_link')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
            </div>
            <div class="w-2/5 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <!-- MEET_DAY -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="meet_day">Meet date</label>
                    <input
                        type="text"
                        id="meet_day"
                        name="meet_day"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="meet_day">
                    <small class="text-sm text-grey-50">Date format: Y-m-d</small>
                    @error('meet_day')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- MEET_FROM -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="meet_from">Meet start</label>
                    <input
                        type="text"
                        id="meet_from"
                        name="meet_from"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="meet_from">
                    <small class="text-sm text-grey-50">Time format: H:i</small>
                    @error('meet_from')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- MEET_TO -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="meet_to">Meet end</label>
                    <input
                        type="text"
                        id="meet_to"
                        name="meet_to"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="meet_to">
                    <small class="text-sm text-grey-50">Time format: H:i</small>
                    @error('meet_to')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- MEET LINK -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="meet_link">Meet link</label>
                    <input
                        type="text"
                        id="meet_link"
                        name="meet_link"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="meet_link">
                    @error('meet_link')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
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
                    @if($action == \App\Http\Livewire\EventPartnerModal::STORE_ACTION && isset($logo_default))
                        <img alt="logo_default" src="{{ $logo_default->temporaryUrl() }}" class="w-16 mt-8 ml-8"/>
                    @elseif($action == \App\Http\Livewire\EventPartnerModal::UPDATE_ACTION  && $event_partner->getFirstMediaUrl('logo_default'))
                        <img alt="logo_default" src="{{  $event_partner->getFirstMediaUrl('logo_default') }}" class="w-16 mt-4 ml-8"/>
                    @endif
                </div>
                <!-- LOGO S4YT -->
                <div class="flex">
                    <div class="flex flex-col">
                        <label class="leading-loose" for="logo_s4yt">S4YT Logo</label>
                        <input
                            type="file"
                            id="logo_s4yt"
                            name="logo_s4yt"
                            wire:model.debounce.500ms="logo_s4yt"
                            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                        <div wire:loading wire:target="logo_s4yt">Uploading...</div>
                        @error('logo_s4yt')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                    </div>
                    @if($action == \App\Http\Livewire\EventPartnerModal::STORE_ACTION && isset($logo_s4yt))
                        <img alt="logo_s4yt" src="{{ $logo_s4yt->temporaryUrl() }}" class="w-16 mt-4 ml-8"/>
                    @elseif($action == \App\Http\Livewire\EventPartnerModal::UPDATE_ACTION && $event_partner->getFirstMediaUrl('logo_s4yt') )
                        <img alt="logo_s4yt" src="{{  $event_partner->getFirstMediaUrl('logo_s4yt') }}" class="w-16 mt-4 ml-8"/>
                    @endif
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
