<div class="mt-12 w-100 flex flex-col items-center">

    <!-- Toast -->
    <div
        class="w-3/6 mx-auto"
        x-data="{ show: false }"
        x-show.transition.opacity.out.duration.2000ms="show"
        x-init="@this.on('showMessage', () => { show = true; setTimeout( () => { show = false;}, 2000) })"
        style="display: none"
    >
        <div class="flex items-center {{ $message_type == 'success' ? 'bg-green-300' : ($message_type == 'info' ? 'bg-blue-300':'bg-red-300') }} rounded-lg p-4 mb-4 text-sm {{ 'text-' . $message_type .'-700' }}" role="alert">
            <i class="text-lg fa-solid {{ $message_type == 'success' ? 'fa-badge-check' : ($message_type == 'info' ? 'fa-circle-info' : 'fa-circle-exclamation') }}"></i>
            <div>
                <span class="font-bold text-base ml-2">{{ $message }}</span>
            </div>
        </div>
    </div>

    <div class="w-3/6 flex justify-end">
        <!-- ACTION BUTTON -->
        <div>
            <button
                wire:click='$emit("openModal", "event-partner-modal", @json(["action" => App\Http\Livewire\EventPartnerModal::STORE_ACTION ]))'
                type="button"
                class="border border-blue-400 bg-blue-400 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:shadow-outline"
            >
                <i class="fa-solid fa-handshake-simple"></i>
            </button>
        </div>
    </div>
    <table class="w-3/6 border-collapse text-center text-sm text-gray-500 mb-8 shadow-md">
        <thead class="bg-gray-50">
        <tr>
            <th scope="col" class="px-6 py-4 font-bold text-gray-900">ID</th>
            <th scope="col" class="px-6 py-4 font-bold text-gray-900">Name</th>
            <th scope="col" class="px-6 py-4 font-bold text-gray-900">Status</th>
            <th scope="col" class="px-6 py-4 font-bold text-gray-900">Actions</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
        @if(sizeof($event_partners) > 0)
            @foreach($event_partners as $event_partner)
                <tr class="hover:bg-gray-200 font-bold even:bg-gray-100 odd:bg-gray-50">
                    <td class="px-6 py-4">{{ $event_partner->id }}</td>
                    <td class="px-6 py-4">{{ $event_partner->organization_name }}</td>
                    <td class="px-6 py-4">
                            <span
                                class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold {{  $event_partner->active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' }}"
                            >
                                <span class="h-1.5 w-1.5 rounded-full {{ $event_partner->active ? 'bg-green-600' : 'bg-red-600' }}"></span>
                                {{ $event_partner->active ? 'Active':'Inactive' }}
                            </span>
                    </td>
                    <td>
                        <button
                            wire:click='$emit("openModal", "event-partner-modal", @json(["action" => App\Http\Livewire\EventPartnerModal::UPDATE_ACTION, "event_partner_id" => $event_partner->id ]))'
                            type="button"
                            class="border border-blue-500 bg-blue-500 text-white rounded-md px-2 py-2 m-2 transition duration-500 ease select-none hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                        >
                            <i class="text-base fa-solid fa-pen-to-square px-1"></i>
                        </button>
                    </td>
                </tr>
            @endforeach
        @else
            <tr>
                <td colspan="4">
                    No event players found
                </td>
            </tr>
        @endif
        </tbody>
    </table>
</div>
