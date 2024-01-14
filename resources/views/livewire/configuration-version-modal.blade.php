<x-modal form-action="processModal">
    <x-slot name="title">
        Configurations version {{ $version->year }}
    </x-slot>

    <x-slot name="content">
        <div class="flex justify-center">
            <div class="w-full text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                @foreach($configurations as $configuration)
                    <div class="flex flex-col">
                        <label class="leading-loose" for="{{$configuration->key}}">{{$configuration->key}}</label>
                        @foreach(explode(".", $configuration->description) as $partial)
                            <small class="text-muted text-xs">{{$partial}}</small>
                        @endforeach
                        <input
                            type="text"
                            id="{{$configuration->key}}"
                            name="{{$configuration->key}}"
                            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            wire:model.debounce.200ms="configuration_version_values.{{ $configuration->key }}.value">
                        @if($errors->has('configuration_version_values.' . $configuration->key . '.value'))
                            <small class="text-red-500 text-xs">{{ $errors->first('configuration_version_values.' . $configuration->key . '.value') }}</small>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    </x-slot>

    <x-slot name="buttons">
        <div class="flex w-full justify-center">
            <div class="pt-4 flex justify-between w-3/5">
                <button class="bg-red-500 text-white flex justify-center items-center w-4/12 px-4 py-3 rounded-md focus:outline-none">
                    Cancel
                </button>
                <button type="submit" class="bg-blue-500 flex justify-center items-center w-4/12 text-white px-4 py-3 rounded-md focus:outline-none">Submit</button>
            </div>
        </div>
    </x-slot>
</x-modal>
