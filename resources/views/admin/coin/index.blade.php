@extends('layouts.admin')

@section('content')
    <div class="container">
        @include('admin.includes.alerts')
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3 d-flex bd-highlight">
            @role('super_admin|admin')
                <a type="submit" class="btn btn-primary text-white col-3" href="{{ route('coin.create',['player'=>$user->id]) }}">
                    <i class="fa fa-skull-crossbones"></i>
                    Add Coins to Player
                </a>
            @endrole
            </div>
        <!-- table -->
        <div class="container content-section mt-3 col-lg-10 offset-lg-1">
            <table class="table table-striped ">
                <thead>
                <tr>
                    <th scope="col" class="text-center">Type</th>
                    <th scope="col" class="text-center">Description</th>
                    <th scope="col" class="text-center">Created</th>
                    <th scope="col" class="text-center">Used on</th>
                    <th scope="col" class="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                @if(count($coins) > 0)
                    @foreach($coins as $coin)
                        <tr>
                            <td class="text-center">{{ ucWords($coin->type->event) }}</td>
                            <td class="text-center">{{ $coin->description ? ucFirst($coin->description->text) : '-' }}</td>
                            <td class="text-center">{{ \Carbon\Carbon::parse($coin->created_at)->format('m/d/y') }}</td>
                            <td class="text-center">{{ $coin->available ? 'N/A' : 'N/A' }}</td>
                            <td>
                                <div class="container d-flex justify-content-center">
                                    @role('super_admin|admin')
                                        <form action="{{ route('coin.destroy',['player'=>$user->id,'coin'=>$coin->id]) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger ml-2 text-white ms-2">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </form>
                                    @endrole
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="4" class="text-center">No Coins found</td>
                    </tr>
                @endif
                </tbody>
            </table>
            <!-- pagination -->
            <div class="row col-lg-12 d-flex justify-content-center flex-nowrap mb-3">
                {{ $coins->links() }}
            </div>
        </div>
    </div>
@endsection
