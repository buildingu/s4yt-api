<x-modal form-action="processModal">
    <x-slot name="title">
        @if($action == \App\Http\Livewire\VersionModal::STORE_ACTION)
            Add version
        @else
            Edit version {{ $year }}
        @endif

    </x-slot>

    <x-slot name="content">
        <div class="flex justify-center">
            <div class="w-full text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <!-- YEAR -->
                <div class="flex flex-col">
                    <label class="leading-loose" for="year">Year</label>
                    <input
                        type="text"
                        id="year"
                        name="year"
                        class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        wire:model.debounce.200ms="year">
                    @error('year')<small class="text-red-500 text-xs">{{ $message }}</small>@enderror
                </div>
                <!-- ACTIVE -->
                <div class="flex items-center mt-4">
                    <div class="flex items-center">
                        <input
                            id="active"
                            aria-describedby="active"
                            type="checkbox"
                            class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-5 w-5 rounded"
                            value="{{ $active }}"
                            checked="{{ $active ? 'true':'false' }}"
                            wire:model="active">
                    </div>
                    <div class="ml-3">
                        <label for="active" class="text-gray-900">Enabled?</label>
                    </div>
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
