@extends('layouts.admin')

@section('content')
    <div class="container">
        <!-- table -->
        <div class="container content-section mt-3 col-lg-10 offset-lg-1">
            <table class="table table-striped ">
                <thead>
                <tr>
                    <th scope="col">Sponsor</th>
                    <th scope="col">Details</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td scope="col">Short Description</td>
                    <td scope="col">{{ $sponsor->short_description }}</td>
                </tr>
                <tr>
                    <td scope="col">Description</td>
                    <td scope="col">{{ $sponsor->description }}</td>
                </tr>
                <tr>
                    <td scope="col">Status</td>
                    <td scope="col"> @if( $sponsor->status == 1 )
                            Active
                        @elseif($sponsor->status == 0)
                            Deactive
                        @endif
                    </td>
                </tr>
                @if($sponsor->image)
                    <tr>
                        <td scope="col">Image</td>
                        <td scope="col"><img src="{{ asset('sponsors/'.$sponsor->image) }}" alt=""></td>
                    </tr>
                @endif

                </tbody>
        </div>
    </div>
@endsection
