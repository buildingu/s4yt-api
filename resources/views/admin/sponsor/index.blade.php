@extends('layouts.admin')

@section('content')
    <div class="container">
        @include('admin.includes.alerts')
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3 d-flex bd-highlight">
            @role('super_admin|admin')
                <a type="submit" class="btn btn-primary text-white col-3" href="{{ route('sponsor.create') }}">
                    <i class="fa fa-skull-crossbones"></i>
                    Create sponsor
                </a>
            @endrole
            </div>
        <!-- table -->
        <div class="container content-section mt-3 col-lg-10 offset-lg-1">
            <table class="table table-striped ">
                <thead>
                <tr>
                    <th scope="col" class="text-center">#</th>
                    <th scope="col" class="text-center">Short Description</th>
                    <th scope="col" class="text-center">Status</th>
                    <th scope="col" class="text-center">Order</th>
                    <th scope="col" class="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                @if(count($sponsors) > 0)
                    @foreach($sponsors as $sponsor)
                        <tr>
                            <td class="text-center">{{ $sponsor->id }}</td>
                            <td class="text-center">{{ \Illuminate\Support\Str::limit($sponsor->short_description,40) }}</td>
                            <td class="text-center">
                                @if( $sponsor->status == 1 )
                                    Active
                                @elseif($sponsor->status == 0)
                                    Deactive
                                @endif
                            </td>
                            <td class="text-center">
                                {{ $sponsor->order }}
                            </td>
                            <td>
                                <div class="container d-flex justify-content-center">
                                    @role('super_admin|admin')
                                        <a type="submit" class="btn btn-primary ml-2 text-white ms-2" href="{{ route('sponsor.show', $sponsor->id) }}">
                                            <i class="fa fa-eye"></i>
                                        </a>
                                        <a type="submit" class="btn btn-primary ml-2 text-white ms-2" href="{{ route('sponsor.edit', $sponsor->id) }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('sponsor.destroy', $sponsor->id) }}" method="POST">
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
                        <td colspan="4" class="text-center">No Sponsors found</td>
                    </tr>
                @endif
                </tbody>
            </table>
            <!-- pagination -->
            <div class="row col-lg-12 d-flex justify-content-center flex-nowrap mb-3">
                {{ $sponsors->links() }}
            </div>
        </div>
    </div>
@endsection
